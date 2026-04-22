const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

if (!configuredApiUrl && !__DEV__) {
  throw new Error("EXPO_PUBLIC_API_URL must be configured for production builds.");
}

export const apiUrl = (configuredApiUrl || "http://localhost:8800").replace(
  /\/+$/,
  "",
);