/** OpenAPI RegisterForTournamentBody; GET /pubg-tournament/{id}/registration-fields item shape */

import type { RegistrationFieldType } from "./pubg-tournament.types";
import type { UserPublicSummary } from "./user.types";

export interface RegisterForTournamentFieldValue {
  field_id: number;
  value: string;
}

export interface RegisterForTournamentBody {
  field_values: RegisterForTournamentFieldValue[];
  friends: number[]; // array of user ids
}

/** Response items include id and timestamps (OpenAPI path pubg-tournament.yaml) */
export interface TournamentRegistrationField {
  id: number;
  label: string;
  type: RegistrationFieldType;
  options?: string | null;
  required: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Registration row from POST /pubg-tournament/:id/register.
 * Derived from backend `entities/PubgRegistration.ts` as returned by `registerForTournament`.
 */
export interface PubgRegistrationResponse {
  id: number;
  paid: boolean;
  payment_method: string | null;
  registered_at: string;
  updated_at: string;
  tournament?: { id: number };
  user?: { id: number };
  friends?: UserPublicSummary[];
}
