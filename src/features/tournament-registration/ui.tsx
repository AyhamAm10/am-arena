import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
import { colors } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMirror } from "./store";
import { styles } from "./styles";
import { FriendOption } from "./store/api";

const fallbackMap = require("../../assets/pubg.jpg");

export function Ui() {
  const router = useRouter();
  const tournament = useMirror("tournament");
  const friends = useMirror("friends");
  const selectedFriendIds = useMirror("selectedFriendIds");
  const toggleFriendSelection = useMirror("toggleFriendSelection");
  const selectedCountLabel = useMirror("selectedCountLabel");
  const onFriendsListEndReached = useMirror("onFriendsListEndReached");
  const onConfirmJoin = useMirror("onConfirmJoin");
  const canSubmit = useMirror("canSubmit");
  const isSubmitting = useMirror("isSubmitting");
  const isLoadingTournament = useMirror("isLoadingTournament");
  const isLoadingRegistrationFields = useMirror("isLoadingRegistrationFields");
  const isLoadingFriends = useMirror("isLoadingFriends");
  const isFetchingMoreFriends = useMirror("isFetchingMoreFriends");

  
  if (isLoadingTournament || isLoadingRegistrationFields || isLoadingFriends) {
    return (
      <SafeAreaView style={styles.rootLoading}>
        <ActivityIndicator size="large" color={colors.primaryPurple} />
      </SafeAreaView>
    );
  }

  const headerImage = tournament?.game?.image
    ? { uri: formatImageUrl(tournament.game.image) }
    : fallbackMap;

    console.log("tournament image", formatImageUrl(tournament?.game.image ?? ""));
    console.log("tournament", tournament);
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backIcon}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Join Tournament</Text>
          <View style={styles.backButtonSpacer} />
        </View>

        <View style={styles.card}>
          <Image source={headerImage} style={styles.cardImage} resizeMode="cover" />
          <View style={styles.cardBody}>
            <Text style={styles.entryFeeText}>
              ENTRY FEE: {tournament?.entry_fee ?? 0} CREDITS
            </Text>
            <Text style={styles.tournamentTitle}>{tournament?.title ?? "PUBG Pro Masters"}</Text>
            <Text style={styles.metaText}>Squad - 100 Teams - Asia Server</Text>
            <View style={styles.poolPill}>
              <Text style={styles.poolText}>Prize Pool: {tournament?.prize_pool ?? 0}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Tournament Details</Text>
        <View style={styles.detailsWrap}>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Format</Text>
            <Text style={styles.detailValue}>Squad (4 Players)</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Mode</Text>
            <Text style={styles.detailValue}>{tournament?.game?.type?.toUpperCase() ?? "TPP"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Map</Text>
            <Text style={styles.detailValue}>{tournament?.game?.map ?? "Erangel"}</Text>
          </View>
        </View>

        <View style={styles.squadHeader}>
          <Text style={styles.sectionTitle}>Select Your Squad</Text>
          <Text style={styles.selectedCounter}>{selectedCountLabel}</Text>
        </View>

        <View style={styles.friendRow}>
          <View style={styles.avatarStub} />
          <View style={styles.friendTextWrap}>
            <Text style={styles.friendName}>You (Captain)</Text>
            <Text style={styles.friendStatus}>Ready</Text>
          </View>
          <View style={[styles.selectCircle, styles.selectCircleActive]} />
        </View>

        <FlatList
          data={friends}
          keyExtractor={(item: FriendOption) => String(item.id)}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          onEndReachedThreshold={0.4}
          onEndReached={onFriendsListEndReached}
          renderItem={({ item }: { item: FriendOption }) => {
            const selected = selectedFriendIds.includes(item.id);
            const blocked = !selected && selectedFriendIds.length >= 3;
            return (
              <TouchableOpacity
                style={[styles.friendRow, blocked && styles.friendRowBlocked]}
                activeOpacity={0.9}
                onPress={() => toggleFriendSelection(item.id)}
              >
                <View style={styles.avatarStub} />
                <View style={styles.friendTextWrap}>
                  <Text style={styles.friendName}>{item.name}</Text>
                  <Text style={styles.friendStatus}>{item.status || "Online"}</Text>
                </View>
                <View style={[styles.selectCircle, selected && styles.selectCircleActive]} />
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={
            isFetchingMoreFriends ? (
              <View style={styles.loadingMoreWrap}>
                <ActivityIndicator size="small" color={colors.primaryPurple} />
              </View>
            ) : null
          }
        />

        <TouchableOpacity
          style={[styles.confirmButton, (!canSubmit || isSubmitting) && styles.confirmButtonDisabled]}
          onPress={onConfirmJoin}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.confirmText}>Confirm Join Tournament</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.walletHint}>
          BY CLICKING CONFIRM, 50 CREDITS WILL BE DEDUCTED FROM YOUR WALLET
        </Text>
      </View>
    </SafeAreaView>
  );
}
