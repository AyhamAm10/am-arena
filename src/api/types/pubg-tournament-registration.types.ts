/** OpenAPI RegisterForTournamentBody; GET /pubg-tournament/{id}/registration-fields item shape */

import type { RegistrationFieldType } from "./pubg-tournament.types";

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
