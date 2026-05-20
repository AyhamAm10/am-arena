import type { PollResponse } from "@/src/api/types/poll.types";
import { flexRowRtl } from "@/src/lib/rtl";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import {
  formatPollCountdown,
  hasUserVoted,
  isOptionSelected,
  pollOptionTitle,
} from "../helpers";

type PollCardProps = {
  poll: PollResponse;
  isVotingPoll: boolean;
  onVote: (pollId: number, optionId: number) => void;
};

export function PollCard({ poll, isVotingPoll, onVote }: PollCardProps) {
  const options = Array.isArray(poll.options) ? poll.options : [];
  const voted = hasUserVoted(poll);
  const disabled = voted || poll.closed || isVotingPoll;

  return (
    <View style={styles.pollCard}>
      <View style={[styles.pollHeaderRow, flexRowRtl]}>
        <View style={styles.pollHeaderMain}>
          <Text style={styles.pollTitle}>{poll.title}</Text>
          {poll.description ? <Text style={styles.pollDescription}>{poll.description}</Text> : null}
        </View>
        <View style={styles.liveBadgeWrap}>
          <Text style={styles.liveBadgeText}>{poll.closed ? "منتهي" : "مباشر"}</Text>
        </View>
      </View>

      <View style={styles.pollOptionsList}>
        {options.map((option) => {
          const selected = isOptionSelected(poll, option);
          const inactiveAfterVote = voted && !selected;
          return (
            <Pressable
              key={option.id}
              disabled={disabled}
              onPress={() => {
                if (disabled) return;
                onVote(poll.id, option.id);
              }}
              style={[
                styles.pollOptionCard,
                voted && selected && styles.pollOptionCardSelected,
                inactiveAfterVote && styles.pollOptionCardInactive,
              ]}
            >
              <View style={[styles.pollOptionRow, flexRowRtl]}>
                <View style={styles.pollOptionLabelWrap}>
                  <Text
                    style={[
                      styles.pollOptionLabel,
                      voted && selected && styles.pollOptionLabelSelected,
                      inactiveAfterVote && styles.pollOptionLabelInactive,
                    ]}
                  >
                    {pollOptionTitle(option)}
                  </Text>
                </View>
                <View style={styles.pollOptionRight}>
                  {selected ? (
                    <View style={styles.selectedDot} />
                  ) : (
                    <View
                      style={[styles.unselectedDot, inactiveAfterVote && styles.pollOptionDotInactive]}
                    />
                  )}
                  <Text
                    style={[
                      styles.pollOptionPercent,
                      voted && selected && styles.pollOptionPercentSelected,
                      inactiveAfterVote && styles.pollOptionPercentInactive,
                    ]}
                  >
                    {Math.round(option.percentage)}%
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
        {options.length === 0 ? (
          <View style={styles.pollOptionCard}>
            <Text style={styles.pollEmptyText}>لا توجد خيارات متاحة لهذا التصويت حالياً.</Text>
          </View>
        ) : null}
      </View>

      <View style={[styles.pollFooterRow, flexRowRtl]}>
        <Text style={styles.pollFooterText}>{formatPollCountdown(poll.expires_at)}</Text>
        {voted ? <Text style={styles.pollFooterLocked}>تم تسجيل صوتك</Text> : null}
      </View>
    </View>
  );
}