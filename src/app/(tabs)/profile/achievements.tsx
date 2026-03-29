import type { UserAchievementEntry } from "@/src/api/types/user.types";
import { useFetchCurrentUser } from "@/src/hooks/api/auth/useFetchCurrentUser";
import { useFetchUserProfile } from "@/src/hooks/api/profile/useFetchUserProfile";
import { useToggleAchievementDisplay } from "@/src/hooks/api/achievement/useToggleAchievementDisplay";
import { formatAchievementIconUrl } from "@/src/lib/utils/image-url-factory";
import { colors } from "@/src/theme/colors";
import { ProfileHeader } from "@/src/features/profile/components/ProfileHeader";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AchievementsListScreen() {
  const router = useRouter();
  const meQuery = useFetchCurrentUser();
  const userId = meQuery.data?.id ? String(meQuery.data.id) : "";
  const profileQuery = useFetchUserProfile(userId, { enabled: Boolean(userId) });
  const toggleMutation = useToggleAchievementDisplay();

  const achievements = profileQuery.data?.achievements ?? [];
  const isLoading = meQuery.isLoading || profileQuery.isLoading;
  const isError = meQuery.isError || profileQuery.isError;

  const handleToggle = useCallback(
    (userAchievementId: number | undefined) => {
      if (userAchievementId == null) return;
      toggleMutation.mutate(userAchievementId);
    },
    [toggleMutation]
  );

  const renderItem = useCallback(
    ({ item }: { item: UserAchievementEntry }) => {
      const a = item.achievement;
      if (!a) return null;

      const accent = a.color_theme?.trim() || colors.primaryPurple;
      const uri = a.icon_url
        ? /^https?:\/\//i.test(a.icon_url)
          ? a.icon_url
          : formatAchievementIconUrl(a.icon_url)
        : null;

      return (
        <View style={[styles.card, { borderColor: accent }]}>
          <View style={styles.cardTop}>
            {uri ? (
              <Image
                source={{ uri }}
                style={styles.icon}
                contentFit="contain"
              />
            ) : (
              <View
                style={[styles.icon, { backgroundColor: accent, opacity: 0.25 }]}
              />
            )}
            <View style={styles.titleBlock}>
              <Text style={[styles.tierLabel, { color: accent }]}>
                {(a.color_theme ?? "").toUpperCase()}
              </Text>
              <Text style={styles.name} numberOfLines={1}>
                {a.name}
              </Text>
            </View>
            <Switch
              value={item.displayed !== false}
              onValueChange={() => handleToggle(item.id)}
              trackColor={{ false: "#3a2e48", true: accent }}
              thumbColor={colors.white}
              style={styles.toggle}
            />
          </View>
          {a.description ? (
            <Text style={styles.description}>"{a.description}"</Text>
          ) : null}
        </View>
      );
    },
    [handleToggle]
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.inner}>
        <ProfileHeader
          title="Achievements"
          showBack
          onBack={() => router.back()}
        />
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primaryPurple} />
          </View>
        ) : isError ? (
          <View style={styles.centered}>
            <Text style={styles.muted}>Could not load achievements.</Text>
          </View>
        ) : (
          <FlatList
            data={achievements}
            keyExtractor={(item, idx) =>
              item.id != null ? String(item.id) : `ach-${idx}`
            }
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.muted}>No achievements earned yet.</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.darkBackground1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  muted: {
    color: colors.grey,
    fontSize: 15,
    textAlign: "center",
  },
  list: {
    paddingBottom: 32,
    paddingTop: 8,
  },
  card: {
    backgroundColor: colors.darkBackground2,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  titleBlock: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0,
  },
  tierLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 2,
  },
  name: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  toggle: {
    marginLeft: 8,
  },
  description: {
    color: colors.grey,
    fontSize: 13,
    fontStyle: "italic",
    marginTop: 10,
    lineHeight: 18,
  },
});
