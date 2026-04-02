import { colors } from "@/src/theme/colors";
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
          onBack={() => router.back()}
          onEditPress={showEditButton ? () => router.push("/profile/edit") : undefined}
          onLogoutPress={showLogoutButton ? () => void logout() : undefined}
          isLoggingOut={showLogoutButton ? isLoggingOut : undefined}
        />

        {isLoadingProfile ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primaryPurple} />
          </View>
        ) : isProfileError || !screenModel ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>تعذّر تحميل الملف الشخصي.</Text>
          </View>
        ) : (
          <>
            <ProfileAvatarSection
              gamerName={screenModel.gamerName}
              fullName={screenModel.fullName}
              profilePictureUrl={screenModel.profilePictureUrl}
              xpPoints={screenModel.xpPoints}
              rankLabel={screenModel.rankLabel}
            />

            {showFriendButton ? (
              <AddFriendButton
                action={friendAction}
                onPress={handleFriendAction}
                loading={isFriendActionBusy}
              />
            ) : null}

            <AchievementBadgesSection
              entries={screenModel.achievements}
              showViewAll={showViewAll}
            />
            <RecentTournamentHistory
              items={screenModel.tournamentHistory}
            />
            <TournamentsWonSection tournaments={screenModel.wonTournaments} />
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
