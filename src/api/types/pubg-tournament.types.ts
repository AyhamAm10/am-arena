export type PubgGameType = "solo" | "duo" | "squad";

export interface Game {
    id: number;
    image: string;
    type: PubgGameType;
    map: string;
    created_at: string;
    updated_at: string;
}

export interface PubgGame {
    id: number;
    title: string;
    description: string;
    entry_fee: number;
    max_players: number;
    prize_pool: number;
    start_date?: string | null;
    end_date?: string | null;
    is_active?: boolean;
    registration_fields?: RegistrationField[];
    game: Game;

}

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
}

export interface ApiPaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
