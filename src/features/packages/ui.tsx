import { AppLayout } from "@/src/components/layout";
import { useCreatePaymentRequest } from "@/src/hooks/api/wallet/useCreatePaymentRequest";
import { useFetchPackages } from "@/src/hooks/api/wallet/useFetchPackages";
import { flexRowRtl, textRtl } from "@/src/lib/rtl";
import { colors_V2 } from "@/src/theme/colors";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export function PackagesScreen() {
  const packagesQuery = useFetchPackages({ enabled: true });
  const createRequest = useCreatePaymentRequest();
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  return (
    <AppLayout scrollable={false}>
      <ScrollView
        contentContainerStyle={styles.wrap}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || packagesQuery.isRefetching}
            onRefresh={async () => {
              setRefreshing(true);
              try {
                await packagesQuery.refetch();
              } finally {
                setRefreshing(false);
              }
            }}
            tintColor={colors_V2.accent}
            colors={[colors_V2.primary, colors_V2.accent]}
          />
        }
      >
        <Text style={[styles.title, textRtl]}>شراء عملات</Text>
        <Text style={[styles.subtitle, textRtl]}>
          اشحن رصيدك واستخدم العملات للمشاركة في البطولات
        </Text>

        {packagesQuery.isLoading ? (
          <ActivityIndicator color={colors_V2.primary} />
        ) : (
          (packagesQuery.data ?? []).map((pkg) => {
            const selected = selectedPackageId === pkg.id;
            return (
              <Pressable
                key={pkg.id}
                style={[styles.card, selected && styles.cardSelected]}
                disabled={createRequest.isPending}
                onPress={() => {
                  if (createRequest.isPending) return;
                  setSelectedPackageId(pkg.id);
                  setMessage(null);
                }}
              >
                <View style={[styles.cardHead, flexRowRtl]}>
                  <Text style={[styles.coins, textRtl]}>
                    {Number(pkg.coins).toLocaleString("ar")} عملة
                  </Text>
                  <Text style={[styles.price, textRtl]}>
                    ${Number(pkg.price || 0).toFixed(2)}
                  </Text>
                </View>
                <Text style={[styles.packageName, textRtl]}>{pkg.name}</Text>
                <Text style={[styles.disabledText, textRtl]}>
                  الدفع المباشر غير متاح - الطلبات تتم يدويًا
                </Text>
                {selected ? (
                  <Pressable
                    style={styles.requestBtn}
                    onPress={async () => {
                      if (createRequest.isPending) return;
                      await createRequest.mutateAsync({
                        package_id: pkg.id,
                        method: "manual",
                      });
                      setMessage("تم إرسال طلبك، وهو الآن قيد الانتظار");
                    }}
                    disabled={createRequest.isPending}
                  >
                    {createRequest.isPending ? (
                      <ActivityIndicator color={colors_V2.textPrimary} />
                    ) : (
                      <Text style={[styles.requestBtnText, textRtl]}>طلب شراء</Text>
                    )}
                  </Pressable>
                ) : null}
              </Pressable>
            );
          })
        )}

        <View style={styles.noteBox}>
          {message ? <Text style={[styles.noteText, textRtl]}>{message}</Text> : null}
          <Text style={[styles.contactText, textRtl]}>
            📞 +9639378729364
          </Text>
          <Text style={[styles.contactText, textRtl]}>
            يرجى التواصل مع الإدارة لإتمام عملية الدفع
          </Text>
        </View>
      </ScrollView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10, paddingBottom: 110 },
  title: { color: colors_V2.textPrimary, fontSize: 24, fontWeight: "800" },
  subtitle: { color: colors_V2.textSecondary, fontSize: 14, fontWeight: "600" },
  card: {
    backgroundColor: colors_V2.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(216,185,255,0.13)",
    gap: 6,
    opacity: 0.96,
  },
  cardSelected: {
    borderColor: colors_V2.accent,
  },
  cardHead: { justifyContent: "space-between", alignItems: "center" },
  coins: { color: colors_V2.accent, fontSize: 22, fontWeight: "900" },
  price: { color: colors_V2.textPrimary, fontSize: 20, fontWeight: "700" },
  packageName: { color: colors_V2.textSecondary, fontSize: 14, fontWeight: "700" },
  disabledText: { color: colors_V2.textSecondary, fontSize: 12, fontWeight: "600" },
  requestBtn: {
    marginTop: 8,
    backgroundColor: colors_V2.primary,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
  },
  requestBtnText: { color: colors_V2.textPrimary, fontSize: 16, fontWeight: "800" },
  noteBox: {
    marginTop: 8,
    backgroundColor: "rgba(111,45,189,0.2)",
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  noteText: { color: colors_V2.textPrimary, fontSize: 14, fontWeight: "700" },
  contactText: { color: colors_V2.primaryLight, fontSize: 13, fontWeight: "700" },
});
