/** Mirrors OpenAPI HeroContent, CreateHeroContentBody, UpdateHeroContentBody */

import type { ApiPaginationMeta } from "./pubg-tournament.types";

export interface HeroContent {
  id: number;
  image: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateHeroContentBody {
  image: string;
  title: string;
  description: string;
}

export interface UpdateHeroContentBody {
  image?: string;
  title?: string;
  description?: string;
}

export interface GetHeroContentsQuery {
  page?: number;
  limit?: number;
}

export type PaginatedHeroContents = {
  data: HeroContent[];
  meta?: ApiPaginationMeta;
};
