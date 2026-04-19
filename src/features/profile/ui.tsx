import { colors_V2 } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { writingRtl } from "@/src/lib/rtl";
import { useMirror } from "./store";
import { AchievementBadgesSection } from "./components/AchievementBadgesSection";
import { AddFriendButton } from "./components/AddFriendButton";
import { ProfileAvatarSection } from "./components/ProfileAvatarSection";
import { ProfileHeader } from "./components/ProfileHeader";
import { RecentTournamentHistory } from "./components/RecentTournamentHistory";
import { TournamentsWonSection } from "./components/TournamentsWonSection";

export function Ui() {
  const router = useRouter();
  const screenModel = useMirror("screenModel");
  const headerTitle = useMirror("headerTitle");
  const showBack = useMirror("showBack");
  const showViewAll = useMirror("showViewAll");
  const showEditButton = useMirror("showEditButton");
  const showLogoutButton = useMirror("showLogoutButton");
  const showFriendButton = useMirror("showFriendButton");
  const isLoadingProfile = useMirror("isLoadingProfile");
  const isProfileError = useMirror("isProfileError");
  const friendAction = useMirror("friendAction");
  const handleFriendAction = useMirror("handleFriendAction");
  const isFriendActionBusy = useMirror("isFriendActionBusy");
  const logout = useMirror("logout");
  const isLoggingOut = useMirror("isLoggingOut");

  const onBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          title={headerTitle}
          showBack={showBack}
          onBack={onBack}
          onEditPress={showEditButton ? () => router.push("/profile/edit") : undefined}
          onLogoutPress={showLogoutButton ? () => void logout() : undefined}
          onViewAllAchievementsPress={
            showViewAll ? () => router.push("/profile/achievements") : undefined
          }
          isLoggingOut={showLogoutButton ? isLoggingOut : undefined}
        />

        {isLoadingProfile ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors_V2.purple} />
          </View>
        ) : isProfileError || !screenModel ? (
          <View style={styles.centered}>
            <Text style={[styles.errorText, writingRtl]}>تعذّر تحميل الملف الشخصي.</Text>
          </View>
        ) : (
          <>
            <ProfileAvatarSection
              gamerName={screenModel.gamerName}
              fullName={screenModel.fullName}
              profilePictureUrl={screenModel.profilePictureUrl}
              xpPoints={screenModel.xpPoints}
              level={screenModel.level}
              selectedTitle={screenModel.selectedTitle}
              selectedAchievement={screenModel.selectedAchievement}
              titlesCount={screenModel.titlesCount}
              tournamentsParticipatedCount={screenModel.tournamentsParticipatedCount}
            />

            {showFriendButton ? (
              <AddFriendButton
                action={friendAction}
                onPress={handleFriendAction}
                loading={isFriendActionBusy}
              />
            ) : null}

            <AchievementBadgesSection
              entries={screenModel.earnedTitles}
              showViewAll={showViewAll}
            />
            <RecentTournamentHistory
              items={screenModel.participatedTournaments}
              isOwnProfile={!showFriendButton}
            />
            <TournamentsWonSection
              tournaments={screenModel.wonTournaments}
              isOwnProfile={!showFriendButton}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors_V2.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 32,
    paddingTop: 8,
  },
  centered: {
    minHeight: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: colors_V2.slate,
    fontSize: 16,
    textAlign: "center",
  },
});
