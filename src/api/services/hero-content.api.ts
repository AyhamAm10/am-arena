import axiosInstance from "../axios/axiosInstance";
import { parseApiResponse } from "../axios/apiResponseParser";
import { ApiResponse } from "../types/api-response";
import { parseApiResponseWithMeta } from "../utils/parseApiResponseWithMeta";
import type {
  CreateHeroContentBody,
  GetHeroContentsQuery,
  HeroContent,
  UpdateHeroContentBody,
} from "../types/hero-content.types";
import type { ApiPaginationMeta } from "../types/pubg-tournament.types";

export async function getHeroContents(query: GetHeroContentsQuery): Promise<{
  data: HeroContent[];
  meta?: ApiPaginationMeta;
}> {
  const res = await axiosInstance.get<ApiResponse<HeroContent[]>>(
    "/hero-content",
    { params: query }
  );
  return parseApiResponseWithMeta(res);
}

export async function getHeroContentById(id: string): Promise<HeroContent> {
  const res = await axiosInstance.get<ApiResponse<HeroContent>>(`/hero-content/${id}`);
  return parseApiResponse(res);
}

export async function createHeroContent(
  body: CreateHeroContentBody
): Promise<HeroContent> {
  const res = await axiosInstance.post<ApiResponse<HeroContent>>(
    "/hero-content",
    body
  );
  return parseApiResponse(res);
}

export async function updateHeroContent(
  id: string,
  body: UpdateHeroContentBody
): Promise<HeroContent> {
  const res = await axiosInstance.patch<ApiResponse<HeroContent>>(
    `/hero-content/${id}`,
    body
  );
  return parseApiResponse(res);
}

export async function deleteHeroContent(id: string): Promise<void> {
  const res = await axiosInstance.delete<ApiResponse<Record<string, never>>>(
    `/hero-content/${id}`
  );
  parseApiResponse(res);
}
