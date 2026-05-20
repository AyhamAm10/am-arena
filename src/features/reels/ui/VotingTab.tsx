import type { PollResponse } from "@/src/api/types/poll.types";
import { colors_V2 } from "@/src/theme/colors";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { PollCard } from "./PollCard";
import { styles } from "../styles";

type VotingTabProps = {
  polls: PollResponse[];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  isVotingPoll: boolean;
  focusPollId?: string;
  refresh: () => Promise<void>;
  voteOnPoll: (pollId: number, optionId: number) => Promise<unknown>;
};

export function VotingTab({
  polls,
  isLoading,
  isRefreshing,
  isError,
  isVotingPoll,
  focusPollId,
  refresh,
  voteOnPoll,
}: VotingTabProps) {
  if (isLoading) {
    return (
      <View style={styles.votingStateWrap}>
        <ActivityIndicator color={colors_V2.primary} size="large" />
        <Text style={styles.votingStateText}>جاري تحميل التصويتات…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.votingStateWrap}>
        <Text style={styles.votingStateText}>تعذّر تحميل التصويتات.</Text>
        <Pressable onPress={() => void refresh()}>
          <Text style={styles.retryText}>إعادة المحاولة</Text>
        </Pressable>
      </View>
    );
  }

  if (polls.length === 0) {
    return (
      <View style={styles.votingStateWrap}>
        <Text style={styles.votingStateText}>لا توجد تصويتات عامة حالياً.</Text>
      </View>
    );
  }

  const flatListRef = useRef<FlatList<PollResponse>>(null);
  const didJumpRef = useRef<string | null>(null);

  useEffect(() => {
    const trimmed = (focusPollId ?? "").trim();
    if (!trimmed) return;
    const idNum = Number(trimmed);
    if (!Number.isFinite(idNum) || idNum <= 0) return;
    if (didJumpRef.current === String(idNum)) return;
    if (polls.length === 0) return;

    const index = polls.findIndex((p) => p.id === idNum);
    if (index < 0) {
      didJumpRef.current = String(idNum);
      return;
    }

    didJumpRef.current = String(idNum);
    flatListRef.current?.scrollToIndex({
      index,
      animated: false,
      viewPosition: 0,
    });
  }, [focusPollId, polls]);

  return (
    <FlatList
      ref={flatListRef}
      data={polls}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.votingListContent}
      showsVerticalScrollIndicator={false}
      onScrollToIndexFailed={() => undefined}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => void refresh()}
          tintColor={colors_V2.primary}
          colors={[colors_V2.primary]}
        />
      }
      renderItem={({ item }) => (
        <PollCard
          poll={item}
          isVotingPoll={isVotingPoll}
          onVote={(pollId, optionId) => {
            void voteOnPoll(pollId, optionId);
          }}
        />
      )}
    />
  );
}