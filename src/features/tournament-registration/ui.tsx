import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
import type { PubgGameType } from "@/src/api/types/pubg-tournament.types";
import type { TournamentRegistrationField } from "@/src/api/types/pubg-tournament-registration.types";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
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
import {
  AnimatedBottomSheet,
  SheetDimmedBackdrop,
  SheetSlidePanel,
} from "@/src/components/motion";
import { rtlMirrorIconStyle } from "@/src/lib/rtl";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useMirror } from "./store";
import { trColors, styles } from "./styles";
import type { FriendOption } from "./store/api";
import {
  getDefaultFieldValue,
  resolvedFieldValue,
} from "./utils";

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

  const [selectModalFieldId, setSelectModalFieldId] = useState<number | null>(
    null
  );

  const gameType = tournament?.game?.type;
  const maxPlayers = tournament?.max_players ?? 16;
  const filledPlayers = 0;
  const fillRatio = maxPlayers > 0 ? filledPlayers / maxPlayers : 0;
  const remainingPct = Math.max(0, Math.min(100, Math.round((1 - fillRatio) * 100)));

  const headerImage = tournament?.game?.image
    ? { uri: formatImageUrl(tournament.game.image) }
    : fallbackMap;

  const selectModalField = useMemo(
    () =>
      registrationFields.find((f) => f.id === selectModalFieldId) ?? null,
    [registrationFields, selectModalFieldId]
  );
  const selectModalOptions = selectModalField
    ? parseSelectOptions(selectModalField)
    : [];

  const loadingGate =
    isLoadingTournament ||
    isLoadingRegistrationFields ||
    isLoadingFriends;

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
            style={styles.textInput}
            placeholderTextColor={trColors.labelMuted}
            placeholder={field.label}
            value={
              fieldValues[field.id] !== undefined
                ? fieldValues[field.id]
                : ""
            }
            onChangeText={(t) => setFieldValue(field.id, t)}
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
            style={styles.textInput}
            placeholderTextColor={trColors.labelMuted}
            placeholder={field.label}
            keyboardType="numeric"
            value={
              fieldValues[field.id] !== undefined
                ? fieldValues[field.id]
                : ""
            }
            onChangeText={(t) => setFieldValue(field.id, t)}
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
            colors={[trColors.purple, trColors.cyan]}
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
          <Text style={styles.progressSub}>
            {remainingPct}% مقاعد متبقية
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.joinButtonWrap,
          (!canSubmit || isSubmitting) && styles.joinButtonDisabled,
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={!canSubmit || isSubmitting}
          onPress={() => void onConfirmJoin()}
        >
          <LinearGradient
            colors={[trColors.purple, trColors.cyan]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.joinButton}
          >
            {isSubmitting ? (
              <ActivityIndicator color={trColors.white} />
            ) : (
              <>
                <Text style={{ fontSize: 18 }}>🎮</Text>
                <Text style={styles.joinButtonText}>انضم للبطولة</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
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
              <Text style={{ color: trColors.cyan, fontSize: 18 }}>👤+</Text>
              <Text style={styles.inviteTitle}>دعوة الأصدقاء</Text>
            </View>
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>{selectedCountLabel}</Text>
            </View>
          </View>
          <View style={styles.searchRow}>
            <Text style={{ color: trColors.labelMuted }}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="ابحث عن الأصدقاء…"
              placeholderTextColor={trColors.labelMuted}
              value={friendSearch}
              onChangeText={setFriendSearch}
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
              ? { uri: formatImageUrl(item.avatarUrl) }
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
    </SafeAreaView>
  );
}
