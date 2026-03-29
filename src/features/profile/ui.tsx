import type {
  AchievementPublic,
  TournamentHistoryItem,
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
import { RecentTournamentHistory } from "./components/RecentTournamentHistory";
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
  const displayVariant = useMirror("displayVariant");
  const currentUser = useMirror("currentUser");
  const otherProfile = useMirror("otherProfile");
  const isLoadingProfile = useMirror("isLoadingProfile");
  const isProfileError = useMirror("isProfileError");
  const isSendingFriendRequest = useMirror("isSendingFriendRequest");
  const handleAddFriend = useMirror("handleAddFriend");
  const friendAction = useMirror("friendAction");
  const handleFriendAction = useMirror("handleFriendAction");
  const isFriendActionBusy = useMirror("isFriendActionBusy");
  const logout = useMirror("logout");
  const isLoggingOut = useMirror("isLoggingOut");
  const tournamentHistory = useMirror("tournamentHistory");

  const data = useMemo((): ProfileScreenModel | null => {
    if (displayVariant === "me" && currentUser) {
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
    if (displayVariant === "other" && otherProfile) {
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
  }, [displayVariant, currentUser, otherProfile]);

  const headerTitle = displayVariant === "me" ? "My Profile" : "Public Profile";
  const showBack = displayVariant === "other";

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
            displayVariant === "me"
              ? () => router.push("/profile/edit")
              : undefined
          }
          onLogoutPress={
            displayVariant === "me" ? () => void logout() : undefined
          }
          isLoggingOut={
            displayVariant === "me" ? isLoggingOut : undefined
          }
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

            {displayVariant === "other" ? (
              <AddFriendButton
                action={friendAction}
                onPress={handleFriendAction}
                loading={isFriendActionBusy}
              />
            ) : null}

            <AchievementBadgesSection
              entries={data.achievements}
              showViewAll={displayVariant === "me"}
            />
            <RecentTournamentHistory
              items={(tournamentHistory ?? []) as TournamentHistoryItem[]}
            />
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
