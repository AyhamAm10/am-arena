import type { PollResponse } from "./poll.types";

export type PubgGameType = "solo" | "duo" | "squad";

/** Sanitized winner row from list/detail API (no full user object). */
export interface PubgTournamentWinnerSummary {
  id: number;
  gamer_name: string;
}

export interface Game {
    id: number;
    image: string;
    type: PubgGameType;
    map: string;
    created_at: string;
    updated_at: string;
}

/**
 * Single PUBG tournament from API (list item or GET /pubg-tournament/:id).
 * Includes nested `game` and optional `registration_fields`.
 */
export interface PubgTournamentDetail {
  id: number;
  title: string;
  description: string;
  entry_fee: number | string;
  max_players: number;
  prize_pool: number | string;
  start_date?: string | null;
  end_date?: string | null;
  is_active?: boolean;
  is_super?: boolean;
  Xp_condition?: number;
  /** Decoded from super tournament description when listing super tournaments. */
  min_xp_required?: number;
  game_type?: string;
  game_ref_id?: number;
  created_at?: string;
  updated_at?: string;
  game: Game;
  registration_fields?: RegistrationField[];
  registered_count?: number;
  /** Present on inactive tournament list items when API loads winners relation. */
  winners?: PubgTournamentWinnerSummary[];
  polls?: PollResponse[];
}

/** @deprecated Use PubgTournamentDetail — kept for gradual migration */
export type PubgGame = PubgTournamentDetail;

export type RegistrationFieldType =
    | "string"
    | "number"
    | "boolean"
    | "select";

export interface RegistrationField {
    label: string;
    type: RegistrationFieldType;
    options?: string | null;
    required: boolean;
}

export interface CreatePubgTournamentBody {
    game: Game;
    title: string;
    description: string;
    type: string;
    entry_fee: number;
    prize_pool: number;
    max_players: number;
    start_date: string;
    end_date: string;
    is_active?: boolean;
    registration_fields?: RegistrationField[];
}


export interface GetPubgTournamentsQuery {
    page?: number;
    limit?: number;
    is_active?: boolean;
    is_super?: boolean;
}

export interface ApiPaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
