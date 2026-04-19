import type { PubgTournamentDetail } from "@/src/api/types/pubg-tournament.types";
import { ActiveTournamentCard } from "@/src/features/tournaments/components/ActiveTournamentCard";
import { PastTournamentCard } from "@/src/features/tournaments/components/PastTournamentCard";
import { TournamentsScreenHeader } from "@/src/features/tournaments/components/TournamentsScreenHeader";
import { tournamentsAr } from "@/src/features/tournaments/strings";
import { arDirection, arWriting } from "@/src/features/tournaments/tournaments-rtl";
import { tournamentsTheme } from "@/src/features/tournaments/theme";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useMirror } from "./store";
import { styles } from "./styles";

export function Ui() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [pastSearch, setPastSearch] = useState("");

  const activeTournaments = useMirror("activeTournaments");
  const pastTournaments = useMirror("pastTournaments");
  const isLoadingActive = useMirror("IsLoadingActiveTournaments");
  const isLoadingPast = useMirror("IsLoadingPastTournaments");
  const activeError = useMirror("ActiveTournamentsError");
  const pastError = useMirror("PastTournamentsError");
  const refetchActive = useMirror("refetchActiveTournaments");
  const refetchPast = useMirror("refetchPastTournaments");
  const joinGates = useMirror("joinGatesByTournamentId");

  const filteredPast = useMemo(() => {
    const list = pastTournaments ?? [];
    const q = pastSearch.trim().toLowerCase();
    if (!q) return list;
    return list.filter((t) => {
      if (t.title.toLowerCase().includes(q)) return true;
      const winners = t.winners ?? [];
      return winners.some((w) => w.gamer_name.toLowerCase().includes(q));
    });
  }, [pastSearch, pastTournaments]);

  const showActiveLoading =
    isLoadingActive ||
    (activeTournaments === undefined && activeError == null);
  const showPastLoading =
    isLoadingPast || (pastTournaments === undefined && pastError == null);

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <TournamentsScreenHeader />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, arDirection]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionPad}>
          <Text
            style={[
              styles.eyebrow,
              { color: tournamentsTheme.eyebrowLive },
            ]}
          >
            {tournamentsAr.liveOperations}
          </Text>
          <Text style={styles.sectionTitle}>{tournamentsAr.activeEvents}</Text>

          {activeError ? (
            <View style={styles.errorBanner}>
              <Text style={[styles.errorText, arWriting]}>{activeError}</Text>
              <TouchableOpacity onPress={() => refetchActive()}>
                <Text style={styles.retry}>{tournamentsAr.retry}</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {showActiveLoading ? (
            <View style={styles.loader}>
              <ActivityIndicator color={tournamentsTheme.openEntry} size="large" />
            </View>
          ) : activeTournaments?.length === 0 ? (
            <View style={styles.centerMsg}>
              <Text style={styles.muted}>{tournamentsAr.noActiveEvents}</Text>
            </View>
          ) : (
            (activeTournaments ?? []).map((t: PubgTournamentDetail) => (
              <ActiveTournamentCard
                key={t.id}
                tournament={t}
                joinGate={joinGates[t.id]}
                onJoinPress={(id) => router.push(`/tournament/${id}/details` as never)}
              />
            ))
          )}
        </View>

        <View style={styles.dividerWrap}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerIcon}>
            <Icon
              name="sports-esports"
              size={22}
              color={tournamentsTheme.bodyMuted}
            />
          </View>
        </View>

        <View style={styles.sectionPad}>
          <Text
            style={[
              styles.eyebrow,
              { color: tournamentsTheme.eyebrowArchive },
            ]}
          >
            {tournamentsAr.archive}
          </Text>
          <Text style={styles.sectionTitle}>{tournamentsAr.pastEvents}</Text>

          {pastError ? (
            <View style={styles.errorBanner}>
              <Text style={[styles.errorText, arWriting]}>{pastError}</Text>
              <TouchableOpacity onPress={() => refetchPast()}>
                <Text style={styles.retry}>{tournamentsAr.retry}</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <TextInput
            style={styles.search}
            placeholder={tournamentsAr.searchPlaceholder}
            placeholderTextColor={tournamentsTheme.bodyMuted}
            value={pastSearch}
            onChangeText={setPastSearch}
            autoCorrect={false}
            autoCapitalize="none"
          />

          {showPastLoading ? (
            <View style={styles.loader}>
              <ActivityIndicator color={tournamentsTheme.openEntry} size="large" />
            </View>
          ) : pastTournaments?.length === 0 ? (
            <View style={styles.centerMsg}>
              <Text style={styles.muted}>{tournamentsAr.noPastEvents}</Text>
            </View>
          ) : filteredPast.length === 0 ? (
            <View style={styles.centerMsg}>
              <Text style={styles.muted}>{tournamentsAr.noMatches}</Text>
            </View>
          ) : (
            filteredPast.map((t) => (
              <PastTournamentCard
                key={t.id}
                tournament={t}
                onReplayPress={(id) => router.push(`/tournament/${id}/details` as never)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
