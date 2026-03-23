# am-arena — role file (project conventions)

This document summarizes **only** structures, patterns, and tooling present in this repository. It is intended as a reference for assistants and contributors.

---

## Project identity

- **Package name:** `am-arena` (`package.json`).
- **Entry:** `expo-router/entry` (`package.json` `main`).
- **App display name / slug:** `am-arena` (`app.json` under `expo.name`, `expo.slug`).
- **Private:** `true` (`package.json`).

---

## Stack and versions (from `package.json`)

- **Runtime / UI:** `react` `19.1.0`, `react-native` `0.81.5`, `expo` `~54.0.33`.
- **Routing:** `expo-router` `~6.0.23`.
- **Server state:** `@tanstack/react-query` `^5.90.21`.
- **HTTP:** `axios` `^1.13.6`.
- **Client state:** `zustand` `^5.0.11`.
- **Images:** `expo-image` `~3.0.11`.
- **Icons:** `@expo/vector-icons`, `react-native-vector-icons` (e.g. MaterialIcons in BottomNav).
- **TypeScript:** `~5.9.2`, `strict: true` (`tsconfig.json`).
- **Lint:** `eslint` `^9.25.0`, `eslint-config-expo` `~10.0.0`; config in `eslint.config.js` (flat config: `eslint-config-expo/flat`, `ignores: ['dist/*']`).

---

## TypeScript configuration (`tsconfig.json`)

- Extends `expo/tsconfig.base`.
- `compilerOptions.allowSyntheticDefaultImports`: `true`.
- `compilerOptions.strict`: `true`.
- **Path alias:** `"@/*"` maps to `./*` (repo root). Imports in source use forms like `@/src/...`.

---

## Expo app config (`app.json`)

- **Scheme:** `amarena`.
- **New Architecture:** `newArchEnabled`: `true`.
- **Plugins:** `expo-router`; `expo-splash-screen` with splash image and light/dark `backgroundColor`.
- **Experiments:** `typedRoutes`: `true`, `reactCompiler`: `true`.
- **Web:** `output`: `static`.
- **Android:** `edgeToEdgeEnabled`: `true`; adaptive icon assets under `assets/images/`.
- **iOS:** `supportsTablet`: `true`.

---

## Scripts (`package.json`)

- `start` → `expo start`
- `android` → `expo start --android`
- `ios` → `expo start --ios`
- `web` → `expo start --web`
- `lint` → `expo lint`
- `reset-project` → `node ./scripts/reset-project.js`

---

## Top-level source layout (observed)

- `src/app/` — Expo Router routes and layouts (`_layout.tsx`, `(tabs)/`, screen files).
- `src/features/` — Tab-level feature modules (e.g. `home`, `tournaments`, `reels`, `channels`, `profile`).
- `src/components/` — Shared UI (e.g. `layout/`, `BottomNav/`, `TopBar/`, `home/`).
- `src/api/` — Axios instance, interceptors, services, response parsing, shared API types.
- `src/hooks/` — Shared hooks (e.g. `use-mirror-factory.ts`, `api/usePubgTournaments.ts`).
- `src/theme/` — Theme tokens (e.g. `colors.ts`).
- `src/constants/` — App constants (e.g. `queryOptions.ts`).
- `src/lib/utils/` — Utilities (e.g. `image-url-factory.ts`).

---

## Routing (`src/app`)

- **Root layout** (`src/app/_layout.tsx`): `Stack` from `expo-router`, `headerShown: false`.
- **Tabs layout** (`src/app/(tabs)/_layout.tsx`):
  - Wraps tab content in `QueryClientProvider` with a module-level `QueryClient`.
  - Uses `Tabs` with `headerShown: false`, native tab bar hidden via `tabBarStyle: { display: "none" }`.
  - Custom bottom bar: `BottomNav` from `../../components/BottomNav/ui/BottomNav`, driven by `useRouter` / `useSegments` and a `TAB_ROUTES` map from labels (`Home`, `Tournaments`, etc.) to paths (`/`, `/tournaments`, …).
  - Declares `Tabs.Screen` entries: `index`, `tournaments`, `reels`, `channels`, `profile`.
- **Tab screens** re-export defaults from features, e.g. `export { Home as default } from '@/src/features/home'` (`src/app/(tabs)/index.tsx` pattern).

---

## Feature modules (`src/features/<name>/`)

### Common files (present where used)

- `factory.tsx` — Exports a `Factory` component.
- `ui.tsx` — Presentational UI.
- `styles.ts` — `StyleSheet.create` exports (e.g. `styles` object) where the feature uses shared layout spacing.
- `index.ts` — Re-exports the feature for the router, pattern: `export { Factory as <FeatureName> } from './factory'` (e.g. `Home`, `Channels`, `Profile`).

### `home` feature (specific structure)

- `factory.tsx`: `Factory` renders `<Api><Ui /></Api>`.
- `api.tsx`: `Api` uses `PropsWithChildren`, calls `useGetPubgTournaments`, registers values via `useMirrorRegistry` from `./store` (`"data"`, `"isLoading"`).
- `store/index.ts`: Builds `useMirror` / `useMirrorRegistry` via `mirrorFactory` from `../../../hooks/use-mirror-factory` and spreads `ApiState()` from `./store/api`.
- `store/api.ts`: Defines `ApiState` type and initial `store` function; exports `ApiState` and type alias `ApiHomeState`.
- `static-data.ts`: Exports `STATIC_TOURNAMENTS`, `STATIC_PLAYERS` aligned with `TournamentItem` / `TopPlayerItem` from `@/src/components/home`.

### Other tab features

- `channels`, `profile`, `reels`, `tournaments`: `Factory` returns `<Ui />` only (no `Api` wrapper in these factories as committed).

---

## `mirrorFactory` pattern (`src/hooks/use-mirror-factory.ts`)

- Uses `zustand` `create` to hold a mirrored object state.
- **`useMirrorRegistry(state, params, trigger?)`:** `useEffect` that `setState`s `[state]: params` when `params` / `trigger` change.
- **`useMirror(state)`:** Selects one key from the store.
- Also exports `useCompareEffect` (value vs reference dependency behavior).
- Per-feature or per-component **store** files (e.g. `src/features/home/store/index.ts`, `src/components/home/tournament-card/state/index.ts`) call `mirrorFactory({ ...InitState() })` where `InitState` / `ApiState` is a `store` function in `state/init.ts` or `store/api.ts`, re-exporting `useMirror` and `useMirrorRegistry`.

---

## Components under `src/components/home/`

### Barrel (`src/components/home/index.ts`)

- Exports: `SuperSub`, `LatestWinner`, `TournamentCard`, default `UpcomingTournaments`, `TopPlayer`, default `TopPlayersSection`, types `TournamentItem`, `TopPlayerItem`.

### Card-style components (tournament-card, top-player, latest-winner, super-sub)

- **`factory.tsx`:** Exports `Factory` (and sometimes `FactoryProps` types). Often composes `Init` + `ui/ui-factory`.
- **`init.tsx`:** `Init` takes `PropsWithChildren` plus init props; calls `useMirrorRegistry` for each field; renders `children`.
- **`state/init.ts`:** Defines TypeScript types and a `store` function returning initial state; exports `store as InitState` and re-exports types (e.g. `InitTournamentCardState`).
- **`state/index.ts`:** Wires `mirrorFactory` with spread `InitState()`.
- **`ui/ui-factory.tsx`:** Default export; reads from `useMirror`, may take `instanceId` for keyed `byId` maps; delegates to a `*View` or `*Card` component.
- **`index.ts`:** Re-exports `Factory` as named export (e.g. `TournamentCard`) and relevant types.

### `UpcomingTournaments.tsx`

- Builds `byId: Record<string, TournamentCardState>` from `TournamentItem[]` via `buildById`.
- Renders horizontal `ScrollView` of `TournamentCard` with `instanceId={t.id}` and shared `byId`.
- Local `StyleSheet` for section/header/title; uses `colors` from `@/src/theme/colors`.

### Layout

- `src/components/layout/AppLayout.tsx`: `SafeAreaView` + `TopBar` + `ScrollView` with inline styles (background `#191021`, horizontal padding, etc.).

### Top bar

- `src/components/TopBar/factory.tsx`: `Factory` takes `InitTopBarState`, passes props to `Init`, wraps `UiFactory`.
- `src/components/TopBar/store/init.ts`: `type` union `"auth" | "unAuth"`, optional `avatarSource`, `level`, `levelProgress`, `coins`.
- `src/components/TopBar/ui/ui-factory.tsx`: Branches on `type` to `LoggedInTopBar` vs `GuestTopBar`.
- `src/components/TopBar/index.ts`: `export { Factory as TopBar } from "./factory"`.

### Bottom navigation

- `src/components/BottomNav/ui/BottomNav.tsx`: Row of `BottomTabItem`, MaterialIcons, active color `colors.primaryPurple`, inactive `colors.white`, container styled with `colors.darkBackground1` / `colors.darkBackground2` borders.

---

## API layer (`src/api`)

### Axios

- **`axiosInstance.ts`:** `axios.create` with `baseURL` from `./api-url`, `Content-Type: application/json`; attaches `requestInterceptor` and `responseInterceptor` (`onSuccess` / `onError`).
- **`api-url.ts`:** Exports `apiUrl` (environment/base URL for the client). **Do not commit secrets;** treat as configurable host reference.
- **`requestInterceptor.ts`:** Ensures headers; reads `accessToken` from `localStorage` and sets `Authorization: Bearer …` when present; sets `Accept-Language: en`.
- **`responseInterceptor.ts`:** Success passes response through; `onError` reads `error.response?.status`, calls `handleApiError`, rethrows.
- **`errorHandler.ts`:** `handleApiError` switches on status `401`, `403`, `400`, `500`, default — currently `console.log` messages.
- **`apiResponseParser.ts`:** `parseApiResponse(response)` reads `response.data`, throws if `!apiResponse.success`, returns `apiResponse.data`.

### Types (`src/api/types`)

- **`api-response.ts`:** `ApiResponse<T>` with `success`, `message`, `data`, optional `meta` (`total`, `page`, `limit`, `totalPages`).
- **`pubg-tournament.types.ts`:** `PubgGame`, `Game`, `PubgGameType`, registration field types, `GetPubgTournamentsQuery`, `CreatePubgTournamentBody`, `ApiPaginationMeta`, etc.

### Services

- Example: `src/api/services/pubg-tournament.api.ts` — `getPubgTournaments` uses `axiosInstance.get<ApiResponse<PubgGame[]>>("/pubg-tournament", { params: query })`, returns `parseApiResponse(res)` from `../axios/apiResponseParser`.

### Duplicate / alternate parser

- `src/api/utils/parseApiResponse.ts` exists with a generic `parseApiResponse<T>` typed to `AxiosResponse<ApiResponse<T>>`. Service code in-repo uses the axios folder parser; be aware both exist.

---

## React Query (`src/hooks/api`, `src/constants`)

- **`usePubgTournaments.ts`:** `useGetPubgTournaments` uses `useQuery<PubgGame[], Error>` with `queryKey: ["pubg-tournaments", query]`, `queryFn` calling `getPubgTournaments`, spreads `defaultQueryOptions` from `@/src/constants/queryOptions`.
- **`queryOptions.ts`:** `defaultQueryOptions` uses `placeholderData: keepPreviousData`, `staleTime: 1000 * 60`.

---

## Theme (`src/theme/colors.ts`)

- Exported `colors` object includes: `primaryPurple`, `neonBlue`, `darkBackground1`, `darkBackground2`, `white`, `grey`, `error`, `gold` (with inline comments in the source file).

---

## Utilities (`src/lib/utils/image-url-factory.ts`)

- **`formatImageUrl(path: string): string`:** Returns `''` for falsy `path`. Normalizes backslashes to slashes. Strips leading `public/uploads/` from path to get `fileName`. Returns `''` if no `fileName`. Otherwise builds URL using `apiUrl` from `@/src/api/axios/api-url` and pattern: `` `${apiUrl}/image/${fileName}` ``.

---

## Assets

- App icons, splash, favicon paths under `assets/images/` per `app.json`.
- Features and components use `require(...)` for images (e.g. `../../assets/pubg.jpg`, `assets/images/...` in config).

---

## Conventions to mirror (observed only)

- **Feature public API:** Prefer `index.ts` exporting `Factory` under the feature’s route name (`Home`, `Tournaments`, …).
- **Composite features:** `home` uses an `Api` child component for data fetching and store registration; `Ui` consumes mirrors and static data.
- **Cards / TopBar:** Prefer `Init` + `UiFactory` + `state` store factory + optional `instanceId` + `byId` for lists.
- **Styling:** Mix of per-file `StyleSheet.create` and theme `colors`; some inline styles in layout.
- **Imports:** Heavy use of `@/src/...` alias consistent with `tsconfig` paths.

---

## Files not to treat as manual edits

- `expo-env.d.ts` states it should not be edited and belongs in git ignore (per file comment).

---

## Out of scope for this document

- No assumptions about deployment, CI, or environment variables beyond what appears in committed files.
- No duplicated literals for hosts, tokens, or credentials — refer to `src/api/axios/api-url.ts` and auth storage usage in `requestInterceptor.ts` when describing behavior.
