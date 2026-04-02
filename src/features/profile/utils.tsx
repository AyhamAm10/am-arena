import type { AchievementPublic } from "@/src/api/types/user.types";
import { type PropsWithChildren, useMemo } from "react";
import { useMirror, useMirrorRegistry } from "./store";
import type { ProfileScreenModel } from "./store/utils";

function getRankLabel(achievements: ProfileScreenModel["achievements"]): string {
  const unlocked = achievements
    .map((entry) => entry.achievement)
    .filter((achievement): achievement is AchievementPublic => achievement != null);

  if (unlocked.length === 0) {
    return "لاعب";
  }

  const topAchievement = [...unlocked].sort(
    (left, right) => right.xp_reward - left.xp_reward
  )[0];

  return topAchievement.name.toUpperCase();
}

function Utils({ children }: PropsWithChildren) {
  const displayVariant = useMirror("displayVariant");
  const profile = useMirror("profile");

  const screenModel = useMemo((): ProfileScreenModel | null => {
    if (!profile) {
      return null;
    }

    return {
      gamerName: profile.user.gamer_name,
      fullName: profile.user.full_name,
      profilePictureUrl: profile.user.profile_picture_url,
      xpPoints: Number(profile.user.xp_points ?? 0),
      achievements: profile.achievements ?? [],
      wonTournaments: profile.won_tournaments ?? [],
      tournamentHistory: profile.tournament_history ?? [],
      rankLabel: getRankLabel(profile.achievements ?? []),
    };
  }, [profile]);

  const isOwnProfile = displayVariant === "me";

  useMirrorRegistry("screenModel", screenModel, screenModel);
  useMirrorRegistry(
    "headerTitle",
    isOwnProfile ? "ملفي الشخصي" : "ملف عام",
    isOwnProfile
  );
  useMirrorRegistry("showBack", !isOwnProfile, isOwnProfile);
  useMirrorRegistry("showViewAll", isOwnProfile, isOwnProfile);
  useMirrorRegistry("showEditButton", isOwnProfile, isOwnProfile);
  useMirrorRegistry("showLogoutButton", isOwnProfile, isOwnProfile);
  useMirrorRegistry("showFriendButton", !isOwnProfile, isOwnProfile);

  return children;
}

export { Utils };
