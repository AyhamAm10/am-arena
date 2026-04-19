import axiosInstance from "../axios/axiosInstance";
import { parseApiResponseWithMeta } from "../utils/parseApiResponseWithMeta";
import type { ApiResponse } from "../types/api-response";
import type { GetAchievementsQuery } from "../types/achievement.types";
import type { AchievementPublic, UserAchievementEntry } from "../types/user.types";

export async function getAchievements(query?: GetAchievementsQuery): Promise<{
  data: AchievementPublic[];
}> {
  const res = await axiosInstance.get<ApiResponse<AchievementPublic[]>>(
    "/achievement",
    { params: query }
  );
  return parseApiResponseWithMeta(res);
}

export async function getMyAchievements(): Promise<UserAchievementEntry[]> {
  const res = await axiosInstance.get<ApiResponse<UserAchievementEntry[]>>(
    "/achievement/my-achievements"
  );
  return res.data.data;
}

export async function toggleAchievementDisplay(
  userAchievementId: number
): Promise<void> {
  await axiosInstance.patch(
    `/achievement/user-achievement/${userAchievementId}/toggle-display`
  );
}

export async function setActiveAchievement(
  userAchievementId: number
): Promise<void> {
  await axiosInstance.patch("/achievement/user-achievement/active", {
    user_achievement_id: userAchievementId,
  });
}
