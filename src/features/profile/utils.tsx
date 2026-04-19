import { computeLevelAndProgress } from "@/src/lib/utils/level-from-xp";
import { type PropsWithChildren, useMemo } from "react";
import { useMirror, useMirrorRegistry } from "./store";
import type { ProfileScreenModel } from "./store/utils";

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
      profilePictureUrl: profile.user.avatarUrl,
      xpPoints: Number(profile.user.xp_points ?? 0),
      selectedTitle: profile.user.selected_achievement?.name?.trim() || null,
      selectedAchievement: profile.user.selected_achievement ?? null,
      titlesCount: Number(profile.stats?.titles_count ?? profile.achievements?.length ?? 0),
      tournamentsParticipatedCount: Number(
        profile.stats?.tournaments_participated_count ??
          profile.tournament_history?.length ??
          0
      ),
      achievements: profile.achievements ?? [],
      earnedTitles: profile.achievements ?? [],
      wonTournaments: profile.won_tournaments ?? [],
      participatedTournaments: profile.tournament_history ?? [],
      level: computeLevelAndProgress(Number(profile.user.xp_points ?? 0)).level,
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
