import { useRouter } from "expo-router";
import { Image } from "expo-image";
import React, { useState, useEffect } from "react";
import { RefreshControl } from "react-native";
import { usePullToRefresh } from "@/src/hooks/usePullToRefresh";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScreenScrollView } from "@/src/components/layout";
import { rtlMirrorIconStyle } from "@/src/lib/rtl";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useMirror } from "./store";
import { colors } from "@/src/theme/colors";
import { styles } from "./styles";

export function Ui() {
  const router = useRouter();

  const fullName = useMirror("fullName");
  const gamerName = useMirror("gamerName");
  const email = useMirror("email");
  const phone = useMirror("phone");
  const profileImageUri = useMirror("profileImageUri");
  const setFullName = useMirror("setFullName");
  const setGamerName = useMirror("setGamerName");
  const setEmail = useMirror("setEmail");
  const setPhone = useMirror("setPhone");

  // Local state to preserve native cursor behavior during typing
  const [fullNameLocal, setFullNameLocal] = useState(fullName);
  const [gamerNameLocal, setGamerNameLocal] = useState(gamerName);
  const [emailLocal, setEmailLocal] = useState(email);
  const [phoneLocal, setPhoneLocal] = useState(phone);

  // Keep locals in sync if external store changes
  useEffect(() => setFullNameLocal(fullName), [fullName]);
  useEffect(() => setGamerNameLocal(gamerName), [gamerName]);
  useEffect(() => setEmailLocal(email), [email]);
  useEffect(() => setPhoneLocal(phone), [phone]);

  const pickImage = useMirror("pickImage");
  const onSubmit = useMirror("onSubmit");
  const canSubmit = useMirror("canSubmit");
  const formError = useMirror("formError");
  const apiError = useMirror("error");
  const isLoading = useMirror("isLoading");
  const isUserError = useMirror("isUserError");
  const showUsernameAvailable = useMirror("showUsernameAvailable");
  const footerCaption = useMirror("footerCaption");
  const remoteAvatarUrl = useMirror("remoteAvatarUrl");
  const showInitialSpinner = useMirror("showInitialSpinner");

  const { refreshing, onRefresh } = usePullToRefresh(async () => {
    // profile store doesn't expose a dedicated refresh method here; no-op placeholder
    return Promise.resolve();
  });

  const mainAvatarSource = profileImageUri
    ? { uri: profileImageUri }
    : remoteAvatarUrl
      ? { uri: remoteAvatarUrl }
      : null;

  const headerThumbSource = mainAvatarSource;

  if (showInitialSpinner) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primaryPurple} />
        </View>
      </SafeAreaView>
    );
  }

  if (isUserError) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.loadingBox}>
          <Text style={styles.errorBanner}>تعذّر تحميل الملف الشخصي.</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={{ color: colors.neonBlue }}>رجوع</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAwareScreenScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primaryPurple} colors={[colors.primaryPurple]} />
        }
      >
          <View style={styles.headerRow}>
            <Pressable
              style={styles.backBtn}
              onPress={() => router.back()}
              hitSlop={8}
            >
              <Icon
                name="arrow-back"
                size={22}
                color={colors.white}
                style={rtlMirrorIconStyle}
              />
            </Pressable>
            <View style={styles.headerCenter}>
              <Text style={styles.brandTitle}>AM ARENA</Text>
              <Text style={styles.editLabel}>تعديل الملف</Text>
            </View>
            <View style={{ width: 44, alignItems: "flex-end" }}>
              {headerThumbSource ? (
                <Image
                  source={headerThumbSource}
                  style={styles.headerAvatar}
                  contentFit="cover"
                />
              ) : (
                <View
                  style={[
                    styles.headerAvatar,
                    { backgroundColor: colors.darkBackground2 },
                  ]}
                />
              )}
            </View>
          </View>

          <View style={styles.avatarBlock}>
            <Pressable
              style={styles.ringOuter}
              onPress={() => void pickImage()}
              accessibilityRole="button"
              accessibilityLabel="تغيير الصورة الشخصية"
            >
              {mainAvatarSource ? (
                <Image
                  source={mainAvatarSource}
                  style={styles.avatarImage}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.avatarImage} />
              )}
              <Pressable
                style={styles.cameraFab}
                onPress={() => void pickImage()}
              >
                <Icon name="photo-camera" size={22} color={colors.white} />
              </Pressable>
            </Pressable>
          </View>

          {apiError ? (
            <Text style={styles.errorBanner}>{apiError}</Text>
          ) : null}
          {formError ? (
            <Text style={styles.formError}>{formError}</Text>
          ) : null}

          <View style={styles.fieldBlock}>
            <View style={styles.labelRow}>
              <Icon name="person" size={16} color={colors.grey} />
              <Text style={styles.labelText}>الاسم الكامل</Text>
            </View>
            <TextInput
              value={fullNameLocal}
              onChangeText={setFullNameLocal}
              onBlur={() => setFullName(fullNameLocal)}
              placeholder="الاسم الكامل"
              placeholderTextColor={colors.grey}
              style={[styles.input, { textAlign: 'right' }]}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.fieldBlock}>
            <View style={styles.labelRow}>
              <Text style={[styles.labelText, { fontSize: 14 }]}>#</Text>
              <Text style={styles.labelText}>اسم اللاعب</Text>
            </View>
            <TextInput
              value={gamerNameLocal}
              onChangeText={setGamerNameLocal}
              onBlur={() => setGamerName(gamerNameLocal)}
              placeholder="اسم اللاعب"
              placeholderTextColor={colors.grey}
              style={[styles.input, styles.inputGamer, { textAlign: 'right' }]}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {showUsernameAvailable ? (
              <View style={styles.usernameAvailable}>
                <Icon name="check-circle" size={16} color={colors.neonBlue} />
                <Text style={styles.usernameAvailableText}>
                  الاسم متاح!
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.fieldBlock}>
            <View style={styles.labelRow}>
              <Icon name="email" size={16} color={colors.grey} />
              <Text style={styles.labelText}>البريد الإلكتروني</Text>
            </View>
            <TextInput
              value={emailLocal}
              onChangeText={setEmailLocal}
              onBlur={() => setEmail(emailLocal)}
              placeholder="username@gmail.com"
              placeholderTextColor={colors.grey}
              style={[styles.input, { textAlign: 'left' }]}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.fieldBlock}>
            <View style={styles.labelRow}>
              <Icon name="phone" size={16} color={colors.grey} />
              <Text style={styles.labelText}>رقم الهاتف</Text>
            </View>
            <TextInput
              value={phoneLocal}
              onChangeText={setPhoneLocal}
              onBlur={() => setPhone(phoneLocal)}
              placeholder="رقم الهاتف"
              placeholderTextColor={colors.grey}
              style={[styles.input, { textAlign: phoneLocal.length > 0 ? 'left' : 'right', writingDirection: 'ltr' }]}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.saveSection}>
            <Pressable
              style={[styles.saveBtn, !canSubmit && styles.saveBtnDisabled]}
              onPress={() => void onSubmit()}
              disabled={!canSubmit || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Icon
                    name="save"
                    size={22}
                    color={
                      canSubmit ? colors.white : colors.grey
                    }
                  />
                  <Text
                    style={[
                      styles.saveBtnText,
                      !canSubmit && styles.saveBtnTextDisabled,
                    ]}
                  >
                    حفظ التغييرات
                  </Text>
                </>
              )}
            </Pressable>
            {footerCaption ? (
              <Text style={styles.footerCaption}>{footerCaption}</Text>
            ) : null}
          </View>
      </KeyboardAwareScreenScrollView>
    </SafeAreaView>
  );
}
