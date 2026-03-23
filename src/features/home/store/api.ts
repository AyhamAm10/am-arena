import { ApiResponse } from "@/src/api/types/api-response";
import { PubgGame } from "@/src/api/types/pubg-tournament.types";


type ApiState = {
    data: PubgGame[] | undefined
    isLoading: boolean
};

const store = (): ApiState => ({
    data: undefined,
    isLoading: false,
});

export { store as ApiState };
export type { ApiState as ApiHomeState };

