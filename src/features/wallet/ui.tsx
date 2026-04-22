import { AppLayout } from "@/src/components/layout";
import { useFetchWallet } from "@/src/hooks/api/wallet/useFetchWallet";
import {
  useFetchWalletTransactionsInfinite,
} from "@/src/hooks/api/wallet/useFetchWalletTransactionsInfinite";
import { flexRowRtl, textRtl } from "@/src/lib/rtl";
import { colors_V2 } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

function statusLabel(status: string) {
  if (status === "approved") return "مكتمل";
  if (status === "rejected") return "مرفوض";
  return "قيد الانتظار";
}

function typeLabel(type: string) {
  if (type === "deposit") return "إيداع";
  return "خصم";
}

export function WalletScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const wasFocusedRef = useRef(false);
  const walletQuery = useFetchWallet({ enabled: true });
  const txQuery = useFetchWalletTransactionsInfinite({ enabled: true, limit: 15 });
  const [refreshing, setRefreshing] = useState(false);

  const transactions = useMemo(
    () => txQuery.data?.pages.flatMap((p) => p.data) ?? [],
    [txQuery.data?.pages],
  );

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([walletQuery.refetch(), txQuery.refetch()]);
    } finally {
      setRefreshing(false);
    }
  }, [txQuery.refetch, walletQuery.refetch]);

  useEffect(() => {
    if (isFocused && !wasFocusedRef.current) {
      wasFocusedRef.current = true;
      void refreshAll();
    } else if (!isFocused) {
      wasFocusedRef.current = false;
    }
  }, [isFocused, refreshAll]);

  return (
    <AppLayout scrollable={false}>
      <View style={styles.wrap}>
        <Text style={[styles.title, textRtl]}>المحفظة</Text>

        <View style={styles.balanceCard}>
          <Text style={[styles.balanceLabel, textRtl]}>الرصيد الحالي</Text>
          {walletQuery.isLoading ? (
            <ActivityIndicator color={colors_V2.gold} />
          ) : (
            <Text style={styles.balanceValue}>
              {Number(walletQuery.data?.balance ?? 0).toLocaleString("ar")} عملة
            </Text>
          )}
          <Pressable
            style={styles.buyButton}
            onPress={() => router.push("/packages")}
          >
            <Text style={[styles.buyText, textRtl]}>شراء عملات</Text>
          </Pressable>
        </View>

        <Text style={[styles.sectionTitle, textRtl]}>آخر العمليات</Text>

        <FlatList
          data={transactions}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || walletQuery.isRefetching || txQuery.isRefetching}
              onRefresh={() => {
                void refreshAll();
              }}
              tintColor={colors_V2.gold}
              colors={[colors_V2.purple, colors_V2.gold]}
            />
          }
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (txQuery.hasNextPage && !txQuery.isFetchingNextPage) {
              void txQuery.fetchNextPage();
            }
          }}
          ListEmptyComponent={
            txQuery.isLoading ? (
              <ActivityIndicator color={colors_V2.purple} />
            ) : (
              <Text style={[styles.emptyText, textRtl]}>لا توجد عمليات حتى الآن.</Text>
            )
          }
          renderItem={({ item }) => {
            const isDeposit = item.type === "deposit";
            const amountPrefix = isDeposit ? "+" : "-";
            const amountColor = isDeposit ? colors_V2.skyBlue : colors_V2.errorLight;
            return (
              <View style={styles.rowCard}>
                <View style={[styles.rowHeader, flexRowRtl]}>
                  <Text style={[styles.rowType, textRtl]}>{typeLabel(item.type)}</Text>
                  <Text style={[styles.rowAmount, { color: amountColor }]}>
                    {amountPrefix}
                    {Math.abs(Number(item.amount || 0)).toLocaleString("ar")}
                  </Text>
                </View>
                <View style={[styles.rowMeta, flexRowRtl]}>
                  <Text style={[styles.rowMetaText, textRtl]}>
                    {statusLabel(item.status)}
                  </Text>
                  <Text style={[styles.rowMetaText, textRtl]}>
                    {new Date(item.created_at).toLocaleDateString("ar")}
                  </Text>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            txQuery.isFetchingNextPage ? (
              <ActivityIndicator color={colors_V2.purple} />
            ) : null
          }
        />
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: 12 },
  title: { color: colors_V2.lilac, fontSize: 24, fontWeight: "800" },
  balanceCard: {
    backgroundColor: colors_V2.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(216,185,255,0.15)",
    gap: 10,
  },
  balanceLabel: { color: colors_V2.slate, fontSize: 14, fontWeight: "700" },
  balanceValue: { color: colors_V2.gold, fontSize: 30, fontWeight: "900" },
  buyButton: {
    backgroundColor: colors_V2.purple,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  buyText: { color: colors_V2.lilac, fontSize: 17, fontWeight: "800" },
  sectionTitle: {
    color: colors_V2.lilac,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 6,
  },
  listContent: { gap: 10, paddingBottom: 120 },
  rowCard: {
    backgroundColor: colors_V2.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(216,185,255,0.12)",
    gap: 6,
  },
  rowHeader: { justifyContent: "space-between", alignItems: "center" },
  rowType: { color: colors_V2.lilac, fontSize: 16, fontWeight: "700" },
  rowAmount: { fontSize: 18, fontWeight: "900" },
  rowMeta: { justifyContent: "space-between", alignItems: "center" },
  rowMetaText: { color: colors_V2.slate, fontSize: 13, fontWeight: "600" },
  emptyText: { color: colors_V2.slate, fontSize: 14, textAlign: "center" },
});
