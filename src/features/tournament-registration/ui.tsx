import { resolveMediaUrl } from "@/src/lib/utils/resolve-media-url";
import type { PubgGameType } from "@/src/api/types/pubg-tournament.types";
import type { TournamentRegistrationField } from "@/src/api/types/pubg-tournament-registration.types";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RefreshControl } from "react-native";
import { usePullToRefresh } from "@/src/hooks/usePullToRefresh";
import { useFetchWallet } from "@/src/hooks/api/wallet/useFetchWallet";
import InsufficientBalanceModal from "@/src/components/modals/InsufficientBalanceModal";
import { KeyboardAwareScreenScrollView } from "@/src/components/layout";
import {
  AnimatedBottomSheet,
  SheetDimmedBackdrop,
  SheetSlidePanel,
} from "@/src/components/motion";
import { rtlMirrorIconStyle, textRtl } from "@/src/lib/rtl";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useMirror } from "./store";
import { trColors, styles } from "./styles";
import type { FriendOption } from "./store/api";
import {
  getDefaultFieldValue,
  resolvedFieldValue,
} from "./utils";
import { colors_V2 } from "@/src/theme/colors";

const fallbackMap = require("../../assets/pubg.jpg");

function teamSizeFromGameType(type: PubgGameType | undefined): number {
  if (type === "duo") return 2;
  if (type === "squad") return 4;
  return 1;
}

function gameTypeLabel(type: PubgGameType | undefined): string {
  if (type === "duo") return "ثنائي";
  if (type === "squad") return "فريق";
  return "فردي";
}

function formatStartSubtitle(
  type: PubgGameType | undefined,
  startDate: string | null | undefined
): string {
  const t = gameTypeLabel(type);
  const n = teamSizeFromGameType(type);
  const mode = `${n}ضد${n}`;
  let datePart = "الموعد لاحقاً";
  if (startDate) {
    const d = new Date(startDate);
    if (!Number.isNaN(d.getTime())) {
      datePart = d
        .toLocaleString("ar", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
          timeZoneName: "short",
        })
        .replace(/،/g, " •");
      datePart = `يبدأ ${datePart}`;
    }
  }
  return `${t} • ${mode} • ${datePart}`;
}

function parseSelectOptions(field: TournamentRegistrationField): string[] {
  if (!field.options) return [];
  return field.options
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
}

export function Ui() {
  const router = useRouter();
  const tournament = useMirror("tournament");
  const friendsTotalCount = useMirror("friendsTotalCount");
  const filteredFriends = useMirror("filteredFriends");
  const registrationFields = useMirror("registrationFields");
  const fieldValues = useMirror("fieldValues");
  const setFieldValue = useMirror("setFieldValue");
  const selectedFriendIds = useMirror("selectedFriendIds");
  const toggleFriendSelection = useMirror("toggleFriendSelection");
  const refreshFriends = useMirror("refreshFriends");
  const selectedCountLabel = useMirror("selectedCountLabel");
  const onFriendsListEndReached = useMirror("onFriendsListEndReached");
  const onConfirmJoin = useMirror("onConfirmJoin");
  const canSubmit = useMirror("canSubmit");
  const isSubmitting = useMirror("isSubmitting");
  const isLoadingTournament = useMirror("isLoadingTournament");
  const isLoadingRegistrationFields = useMirror("isLoadingRegistrationFields");
  const isLoadingFriends = useMirror("isLoadingFriends");
  const isFetchingMoreFriends = useMirror("isFetchingMoreFriends");
  const showSquadFriends = useMirror("showSquadFriends");
  const termsAccepted = useMirror("termsAccepted");
  const setTermsAccepted = useMirror("setTermsAccepted");
  const friendSearch = useMirror("friendSearch");
  const setFriendSearch = useMirror("setFriendSearch");
  const [friendSearchLocal, setFriendSearchLocal] = useState(friendSearch);
  useEffect(() => setFriendSearchLocal(friendSearch), [friendSearch]);
  const levelGateMessage = useMirror("levelGateMessage") as string | null;

  const [selectModalFieldId, setSelectModalFieldId] = useState<number | null>(
    null
  );

  // Local map for dynamic field inputs to preserve cursor behavior
  const [localFieldValues, setLocalFieldValues] = useState<Record<number, string>>(() => {
    const init: Record<number, string> = {};
    registrationFields.forEach((f) => {
      init[f.id] = fieldValues[f.id] ?? "";
    });
    return init;
  });

  // Keep localFieldValues in sync when store changes externally
  useEffect(() => {
    setLocalFieldValues((cur) => {
      const next = { ...cur };
      registrationFields.forEach((f) => {
        next[f.id] = fieldValues[f.id] ?? "";
      });
      return next;
    });
  }, [registrationFields, fieldValues]);

  const gameType = tournament?.game?.type;
  const maxPlayers = tournament?.max_players ?? 16;
  const filledPlayers = tournament?.participant_count ?? tournament?.registered_count ?? 0;
  const fillRatio = maxPlayers > 0 ? filledPlayers / maxPlayers : 0;
  const remainingSlots = Math.max(0, maxPlayers - filledPlayers);
  const remainingPct = Math.max(0, Math.min(100, Math.round((1 - fillRatio) * 100)));

  const headerImage = tournament?.game?.image
    ? { uri: resolveMediaUrl(tournament.game.image, "image") }
    : fallbackMap;

  const selectModalField = useMemo(
    () =>
      registrationFields.find((f) => f.id === selectModalFieldId) ?? null,
    [registrationFields, selectModalFieldId]
  );
  const selectModalOptions = selectModalField
    ? parseSelectOptions(selectModalField)
    : [];

  const { refreshing, onRefresh } = usePullToRefresh(() => (refreshFriends ? refreshFriends() : Promise.resolve()));

  const loadingGate =
    isLoadingTournament ||
    isLoadingRegistrationFields ||
    isLoadingFriends;

  const walletQuery = useFetchWallet({ enabled: true });
  const walletBalance = Number(walletQuery.data?.balance ?? 0);
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);

  const entryFee = Number(tournament?.entry_fee ?? 0);
  const handleJoinPress = () => {
    if (entryFee > 0 && entryFee > walletBalance) {
      setShowInsufficientModal(true);
      return;
    }
    void onConfirmJoin();
  };

  if (loadingGate) {
    return (
      <SafeAreaView style={styles.rootLoading}>
        <ActivityIndicator size="large" color={trColors.purple} />
      </SafeAreaView>
    );
  }

  const renderDynamicField = (field: TournamentRegistrationField) => {
    const displayValue = resolvedFieldValue(field, fieldValues);

    if (field.type === "string") {
      return (
        <View key={field.id} style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>{field.label.toUpperCase()}</Text>
          <TextInput
            style={[styles.textInput, { textAlign: 'right' }]}
            placeholderTextColor={trColors.labelMuted}
            placeholder={field.label}
            value={localFieldValues[field.id] !== undefined ? localFieldValues[field.id] : ""}
            onChangeText={(t) => setLocalFieldValues((s) => ({ ...s, [field.id]: t }))}
            onBlur={() => setFieldValue(field.id, localFieldValues[field.id] ?? "")}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      );
    }

    if (field.type === "number") {
      return (
        <View key={field.id} style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>{field.label.toUpperCase()}</Text>
          <TextInput
            style={[styles.textInput, { textAlign: 'left', writingDirection: 'ltr' }]}
            placeholderTextColor={trColors.labelMuted}
            placeholder={field.label}
            keyboardType="numeric"
            value={localFieldValues[field.id] !== undefined ? localFieldValues[field.id] : ""}
            onChangeText={(t) => setLocalFieldValues((s) => ({ ...s, [field.id]: t }))}
            onBlur={() => setFieldValue(field.id, localFieldValues[field.id] ?? "")}
          />
        </View>
      );
    }

    if (field.type === "select") {
      return (
        <View key={field.id} style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>{field.label.toUpperCase()}</Text>
          <TouchableOpacity
            style={styles.selectField}
            activeOpacity={0.85}
            onPress={() => setSelectModalFieldId(field.id)}
          >
            <Text style={styles.selectFieldText} numberOfLines={1}>
              {displayValue || getDefaultFieldValue(field)}
            </Text>
            <Text style={{ color: trColors.labelMuted, fontSize: 12 }}>▼</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (field.type === "boolean") {
      const on = displayValue === "true";
      return (
        <View key={field.id} style={styles.fieldBlock}>
          <TouchableOpacity
            style={styles.boolRow}
            activeOpacity={0.85}
            onPress={() => setFieldValue(field.id, on ? "false" : "true")}
          >
            <View style={[styles.checkBox, on && styles.checkBoxOn]}>
              {on ? (
                <Text style={{ color: trColors.bg, fontWeight: "900" }}>✓</Text>
              ) : null}
            </View>
            <Text style={styles.termsText}>{field.label}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const listHeader = (
    <>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon
            name="arrow-back"
            size={24}
            color={trColors.white}
            style={rtlMirrorIconStyle}
          />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>الانضمام للبطولة</Text>
        <View style={styles.backButtonSpacer} />
      </View>

      <View style={styles.heroCard}>
        <View>
          <Image
            source={headerImage}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroImageOverlayTop} pointerEvents="none">
            <View style={styles.heroPubgPill}>
              <Text style={styles.heroPubgText}>ببجي موبايل</Text>
            </View>
          </View>
          <LinearGradient
            colors={[trColors.purple, colors_V2.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.heroLiveBadge}
          >
            <Text style={styles.heroLiveText}>تصفيات مباشرة</Text>
          </LinearGradient>
        </View>
        <View style={styles.heroBody}>
          <Text style={styles.heroTitle}>
            {(tournament?.title ?? "").toUpperCase()}
          </Text>
          <Text style={styles.heroSubtitle}>
            {formatStartSubtitle(gameType, tournament?.start_date ?? null)}
          </Text>
          <View style={styles.participantBadgeRow}>
            <View style={styles.participantBadge}>
              <Text style={styles.participantBadgeIcon}>🔥</Text>
              <Text style={styles.participantBadgeText}>
                {filledPlayers.toLocaleString("en-US")} مشارك انضم
              </Text>
            </View>
            <Text style={styles.participantBadgeMeta}>
              {remainingSlots > 0
                ? `${remainingSlots.toLocaleString("en-US")} مقعد متبقي`
                : "اكتملت المقاعد"}
            </Text>
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>عدد اللاعبين</Text>
            <Text style={styles.progressCount}>
              {filledPlayers} / {maxPlayers}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.round(fillRatio * 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressSub}>{remainingPct}% مقاعد متبقية</Text>
        </View>
      </View>

      <View style={styles.joinButtonSection}>
        <View
          style={[
            styles.joinButtonWrap,
            (!canSubmit || isSubmitting) && styles.joinButtonDisabled,
          ]}
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="انضم للبطولة"
            accessibilityState={{ disabled: !canSubmit || isSubmitting }}
            accessibilityHint={
              levelGateMessage && !canSubmit ? levelGateMessage : undefined
            }
            activeOpacity={0.9}
            disabled={!canSubmit || isSubmitting}
            onPress={handleJoinPress}
          >
            <LinearGradient
              colors={[trColors.purple, colors_V2.gradientEnd]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.joinButton}
            >
              {isSubmitting ? (
                <ActivityIndicator color={trColors.white} />
              ) : (
                <Text style={styles.joinButtonText}>انضم للبطولة</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {levelGateMessage ? (
          <Text style={[styles.levelGateHint, textRtl]}>{levelGateMessage}</Text>
        ) : null}
      </View>

      {registrationFields.map((f) => renderDynamicField(f))}

      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>حجم الفريق</Text>
        <View style={styles.selectField}>
          <Text style={styles.selectFieldText}>
            {String(teamSizeFromGameType(gameType))}
          </Text>
        </View>
      </View>

      <View style={styles.fieldBlock}>
        <TouchableOpacity
          style={styles.boolRow}
          activeOpacity={0.85}
          onPress={() => setTermsAccepted(!termsAccepted)}
        >
          <View
            style={[styles.checkBox, termsAccepted && styles.checkBoxOn]}
          >
            {termsAccepted ? (
              <Text style={{ color: trColors.bg, fontWeight: "900" }}>✓</Text>
            ) : null}
          </View>
          <Text style={styles.termsText}>
            أوافق على قواعد البطولة ومدونة السلوك. أؤكد أن جميع أعضاء الفريق فوق
            16 عاماً.
          </Text>
        </TouchableOpacity>
      </View>

      {showSquadFriends ? (
        <>
          <View style={styles.inviteHeader}>
            <View style={styles.inviteTitleRow}>
              <Text style={styles.inviteTitle}>دعوة الأصدقاء</Text>
            </View>
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>{selectedCountLabel}</Text>
            </View>
          </View>
          <View style={styles.searchRow}>
            <Icon name="search" size={18} color={trColors.labelMuted} />
            <TextInput
              style={[styles.searchInput, { textAlign: 'right' }]}
              placeholder="ابحث عن الأصدقاء…"
              placeholderTextColor={trColors.labelMuted}
              value={friendSearchLocal}
              onChangeText={setFriendSearchLocal}
              onBlur={() => setFriendSearch(friendSearchLocal)}
            />
          </View>
        </>
      ) : null}
    </>
  );

  const listFooter = showSquadFriends ? (
    <>
      <TouchableOpacity style={styles.viewAllFriends} activeOpacity={0.8}>
        <Text style={styles.viewAllFriendsText}>
          عرض كل الأصدقاء ({friendsTotalCount})
        </Text>
      </TouchableOpacity>
      {isFetchingMoreFriends ? (
        <View style={styles.loadingMoreWrap}>
          <ActivityIndicator size="small" color={trColors.purple} />
        </View>
      ) : null}
    </>
  ) : null;

  return (
    <SafeAreaView style={styles.root}>
      {/** Pull-to-refresh wired to mirror-registered friends refresh if available */}
      <KeyboardAwareScreenScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <FlatList
          data={showSquadFriends ? filteredFriends : []}
          keyExtractor={(item: FriendOption) => String(item.id)}
          ListHeaderComponent={listHeader}
          contentContainerStyle={styles.scrollContent}
          style={styles.scroll}
          keyboardShouldPersistTaps="handled"
          onEndReachedThreshold={0.35}
          onEndReached={onFriendsListEndReached}
          renderItem={({ item }: { item: FriendOption }) => {
            const selected = selectedFriendIds.includes(item.id);
            const blocked = !selected && selectedFriendIds.length >= 3;
            const avatarSource = item.avatarUrl
              ? { uri: resolveMediaUrl(item.avatarUrl, "image") }
              : undefined;
            return (
              <TouchableOpacity
                style={[styles.friendRow, blocked && styles.friendRowBlocked]}
                activeOpacity={0.9}
                onPress={() => toggleFriendSelection(item.id)}
              >
                {avatarSource ? (
                  <Image
                    source={avatarSource}
                    style={styles.friendAvatar}
                  />
                ) : (
                  <View style={styles.friendAvatar} />
                )}
                <View style={styles.friendTextWrap}>
                  <Text style={styles.friendName}>{item.name}</Text>
                  <Text style={styles.friendStatus}>
                    {item.status || "متصل"}
                  </Text>
                </View>
                <View
                  style={[
                    styles.selectCircle,
                    selected && styles.selectCircleActive,
                  ]}
                >
                  {selected ? (
                    <Text style={{ color: trColors.white, fontWeight: "900" }}>
                      ✓
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={showSquadFriends ? listFooter : null}
        />
      </KeyboardAwareScreenScrollView>

      <AnimatedBottomSheet
        visible={selectModalFieldId !== null}
        onRequestClose={() => setSelectModalFieldId(null)}
      >
        <View style={styles.modalBackdropHost}>
          <SheetDimmedBackdrop onPress={() => setSelectModalFieldId(null)} />
          <SheetSlidePanel style={styles.modalSheet}>
            <FlatList
              data={selectModalOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    if (selectModalField) {
                      setFieldValue(selectModalField.id, item);
                    }
                    setSelectModalFieldId(null);
                  }}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </SheetSlidePanel>
        </View>
      </AnimatedBottomSheet>
      <InsufficientBalanceModal
        visible={showInsufficientModal}
        onRequestClose={() => setShowInsufficientModal(false)}
        balance={walletBalance}
        required={entryFee}
      />
    </SafeAreaView>
  );
}
