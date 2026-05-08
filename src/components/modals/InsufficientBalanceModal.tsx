import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, RefreshControl } from "react-native";
import { usePullToRefresh } from "@/src/hooks/usePullToRefresh";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AnimatedPopoverModal } from "@/src/components/motion";
import { useRouter } from "expo-router";
import { colors_V2 } from "@/src/theme/colors";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  visible: boolean;
  onRequestClose: () => void;
  balance: number;
  required: number;
};

export function InsufficientBalanceModal({ visible, onRequestClose, balance, required }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const missing = Math.max(0, required - balance);

  const handleTopUp = () => {
    onRequestClose();
    router.push('/wallet');
  };

  const { refreshing, onRefresh } = usePullToRefresh(async () => Promise.resolve());

  return (
    <AnimatedPopoverModal visible={visible} onRequestClose={onRequestClose}>
      {/* Full-screen overlay/backdrop that centers the modal */}
      <View style={styles.overlay} pointerEvents="box-none">
        <Pressable
          accessibilityLabel="Close"
          onPress={onRequestClose}
          style={styles.backdrop}
        />

        <View style={styles.centerContainer} pointerEvents="box-none">
          <View style={[styles.modalCard, { paddingTop: Math.max(24, insets.top + 8) }]}> 
            <ScrollView
              style={styles.contentScroll}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
              <View style={styles.headerRow}>
                <View style={styles.iconWrap}>
                  <Text style={styles.icon}>⚠️</Text>
                </View>
                <View style={styles.titleWrap}>
                  <Text style={styles.title}>الرصيد غير كافٍ</Text>
                  <Text style={styles.desc}>لا تملك رصيداً كافياً للاشتراك في هذه البطولة.</Text>
                </View>
                {/* <Pressable onPress={onRequestClose} style={styles.closeBtn} accessibilityLabel="اغلاق">
                  <Icon name="close" size={18} color={colors_V2.textSecondary} />
                </Pressable> */}
              </View>

              <View style={styles.infoList}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>الرصيد الحالي</Text>
                  <Text style={styles.infoValueNeutral}>{Number(balance ?? 0).toLocaleString('ar')} عملة</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>رسم الاشتراك</Text>
                  <Text style={styles.infoValueAccent}>{Number(required ?? 0).toLocaleString('ar')} عملة</Text>
                </View>
                {missing > 0 ? (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>المتبقي</Text>
                    <Text style={styles.infoValueMissing}>{Number(missing).toLocaleString('ar')} عملة</Text>
                  </View>
                ) : null}
              </View>
            </ScrollView>

            <View style={styles.buttonsRow}>
              <Pressable onPress={handleTopUp} style={styles.primaryWrapper} android_ripple={{ color: 'rgba(255,255,255,0.06)' }}>
                <LinearGradient
                  colors={["#8B5CF6", "#5EEAD4"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.primaryBtn}
                >
                  <Text style={styles.primaryText}>شحن الرصيد</Text>
                </LinearGradient>
              </Pressable>

              <Pressable style={styles.secondaryBtn} onPress={onRequestClose} android_ripple={{ color: 'rgba(255,255,255,0.03)' }}>
                <Text style={styles.secondaryText}>لاحقاً</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </AnimatedPopoverModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  centerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  modalCard: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 20,
  },
  contentScroll: {
    width: '100%',
  },
  contentContainer: {
    paddingBottom: 6,
  },
  headerRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 12 , justifyContent: 'space-between' , width: '100%' },
  iconWrap: { width: 56, height: 56, borderRadius: 14, backgroundColor: 'rgba(139,92,246,0.12)', alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  icon: { fontSize: 26 },
  titleWrap: { flex: 1 },
  title: { color: colors_V2.textPrimary, fontSize: 20, fontWeight: '900', textAlign: 'right' },
  desc: { color: colors_V2.textSecondary, fontSize: 13, marginTop: 6, textAlign: 'right', lineHeight: 20 },
  infoList: { marginTop: 8 },
  infoRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, alignSelf: 'stretch' },
  infoLabel: { color: colors_V2.textSecondary, fontSize: 13, fontWeight: '700', textAlign: 'right' },
  infoValueNeutral: { color: colors_V2.textPrimary, fontSize: 15, fontWeight: '900', textAlign: 'right' },
  infoValueAccent: { color: colors_V2.accent, fontSize: 15, fontWeight: '900', textAlign: 'right' },
  infoValueMissing: { color: colors_V2.error, fontSize: 15, fontWeight: '900', textAlign: 'right' },
  buttonsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 },
  primaryWrapper: { flex: 1, borderRadius: 12, overflow: 'hidden', marginRight: 12 },
  primaryBtn: { paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#0B1020', fontSize: 15, fontWeight: '900' },
  secondaryBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'transparent' },
  secondaryText: { color: colors_V2.textPrimary, fontSize: 15, fontWeight: '700' },
  closeBtn: { position: 'absolute', right: 14, top: 14, width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});

export default InsufficientBalanceModal;
