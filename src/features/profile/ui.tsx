import type {
  AchievementPublic,
  TournamentSummary,
} from "@/src/api/types/user.types";
import { colors } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMirror } from "./store";
import { AchievementBadgesSection } from "./components/AchievementBadgesSection";
import { AddFriendButton } from "./components/AddFriendButton";
import { ProfileAvatarSection } from "./components/ProfileAvatarSection";
import { ProfileHeader } from "./components/ProfileHeader";
import { TournamentsWonSection } from "./components/TournamentsWonSection";

type AchievementRow = {
  obtained_at: string;
  achievement: AchievementPublic | null;
};

function deriveRankLabel(achievements: AchievementRow[]): string {
  const list = achievements
    .map((e) => e.achievement)
    .filter((a): a is AchievementPublic => a != null);
  if (list.length === 0) {
    return "PLAYER";
  }
  const top = [...list].sort((a, b) => b.xp_reward - a.xp_reward)[0];
  return top.name.toUpperCase();
}

type ProfileScreenModel = {
  gamerName: string;
  fullName: string;
  profilePictureUrl: string | null;
  xpPoints: number;
  achievements: AchievementRow[];
  wonTournaments: TournamentSummary[];
  rankLabel: string;
};

export function Ui() {
  const router = useRouter();
  const variant = useMirror("variant");
  const currentUser = useMirror("currentUser");
  const otherProfile = useMirror("otherProfile");
  const isLoadingProfile = useMirror("isLoadingProfile");
  const isProfileError = useMirror("isProfileError");
  const isSendingFriendRequest = useMirror("isSendingFriendRequest");
  const handleAddFriend = useMirror("handleAddFriend");
  const logout = useMirror("logout");
  const isLoggingOut = useMirror("isLoggingOut");

  const data = useMemo((): ProfileScreenModel | null => {
    if (variant === "me" && currentUser) {
      const achievements = (currentUser.achievements ?? []) as AchievementRow[];
      return {
        gamerName: currentUser.gamer_name,
        fullName: currentUser.full_name,
        profilePictureUrl: currentUser.profile_picture_url,
        xpPoints: Number(currentUser.xp_points ?? 0),
        achievements,
        wonTournaments: [],
        rankLabel: deriveRankLabel(achievements),
      };
    }
    if (variant === "other" && otherProfile) {
      const u = otherProfile.user;
      const achievements = (otherProfile.achievements ?? []) as AchievementRow[];
      return {
        gamerName: u.gamer_name,
        fullName: u.full_name,
        profilePictureUrl: u.profile_picture_url,
        xpPoints: Number(u.xp_points ?? 0),
        achievements,
        wonTournaments: otherProfile.won_tournaments ?? [],
        rankLabel: deriveRankLabel(achievements),
      };
    }
    return null;
  }, [variant, currentUser, otherProfile]);

  const headerTitle = variant === "me" ? "My Profile" : "Public Profile";
  const showBack = variant === "other";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          title={headerTitle}
          showBack={showBack}
          onBack={() => router.back()}
          onEditPress={
            variant === "me"
              ? () => router.push("/profile/edit")
              : undefined
          }
          onLogoutPress={variant === "me" ? () => void logout() : undefined}
          isLoggingOut={variant === "me" ? isLoggingOut : undefined}
        />

        {isLoadingProfile ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primaryPurple} />
          </View>
        ) : isProfileError || !data ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Could not load profile.</Text>
          </View>
        ) : (
          <>
            <ProfileAvatarSection
              gamerName={data.gamerName}
              fullName={data.fullName}
              profilePictureUrl={data.profilePictureUrl}
              xpPoints={data.xpPoints}
              rankLabel={data.rankLabel}
            />

            {variant === "other" ? (
              <AddFriendButton
                onPress={handleAddFriend}
                loading={isSendingFriendRequest}
              />
            ) : null}

            <AchievementBadgesSection entries={data.achievements} />
            <TournamentsWonSection tournaments={data.wonTournaments} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.darkBackground1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 4,
  },
  centered: {
    minHeight: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: colors.grey,
    fontSize: 16,
  },
});
