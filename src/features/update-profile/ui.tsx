import { colors as themeColors } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useMirror } from "./store";
import { colors, styles } from "./styles";

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

  const mainAvatarSource = profileImageUri
    ? { uri: profileImageUri }
    : remoteAvatarUrl
      ? { uri: remoteAvatarUrl }
      : null;

  const headerThumbSource = mainAvatarSource;

  if (showInitialSpinner) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={themeColors.primaryPurple} />
        </View>
      </SafeAreaView>
    );
  }

  if (isUserError) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.loadingBox}>
          <Text style={styles.errorBanner}>Could not load profile.</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={{ color: colors.neonCyan }}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <Pressable
              style={styles.backBtn}
              onPress={() => router.back()}
              hitSlop={8}
            >
              <Icon name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>
            <View style={styles.headerCenter}>
              <Text style={styles.brandTitle}>AETHER ARENA</Text>
              <Text style={styles.editLabel}>EDIT PROFILE</Text>
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
                    { backgroundColor: colors.inputBg },
                  ]}
                />
              )}
            </View>
          </View>

          <View style={styles.avatarBlock}>
            <View style={styles.ringOuter}>
              {mainAvatarSource ? (
                <Image
                  source={mainAvatarSource}
                  style={styles.avatarImage}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.avatarImage} />
              )}
              <Pressable style={styles.cameraFab} onPress={pickImage}>
                <Icon name="photo-camera" size={22} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          {apiError ? (
            <Text style={styles.errorBanner}>{apiError}</Text>
          ) : null}
          {formError ? (
            <Text style={styles.formError}>{formError}</Text>
          ) : null}

          <View style={styles.fieldBlock}>
            <View style={styles.labelRow}>
              <Icon name="person" size={16} color={colors.labelMuted} />
              <Text style={styles.labelText}>FULL NAME</Text>
            </View>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full name"
              placeholderTextColor={colors.labelMuted}
              style={styles.input}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.fieldBlock}>
            <View style={styles.labelRow}>
              <Text style={[styles.labelText, { fontSize: 14 }]}>#</Text>
              <Text style={styles.labelText}>GAMER NAME</Text>
            </View>
            <TextInput
              value={gamerName}
              onChangeText={setGamerName}
              placeholder="Gamer name"
              placeholderTextColor={colors.labelMuted}
              style={[styles.input, styles.inputGamer]}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {showUsernameAvailable ? (
              <View style={styles.usernameAvailable}>
                <Icon name="check-circle" size={16} color={colors.successGreen} />
                <Text style={styles.usernameAvailableText}>
                  USERNAME AVAILABLE!
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.fieldBlock}>
            <View style={styles.labelRow}>
              <Icon name="email" size={16} color={colors.labelMuted} />
              <Text style={styles.labelText}>EMAIL ADDRESS</Text>
            </View>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={colors.labelMuted}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.fieldBlock}>
            <View style={styles.labelRow}>
              <Icon name="phone" size={16} color={colors.labelMuted} />
              <Text style={styles.labelText}>PHONE NUMBER</Text>
            </View>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone"
              placeholderTextColor={colors.labelMuted}
              style={styles.input}
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
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Icon
                    name="save"
                    size={22}
                    color={
                      canSubmit ? "#FFFFFF" : colors.disabledBtnText
                    }
                  />
                  <Text
                    style={[
                      styles.saveBtnText,
                      !canSubmit && styles.saveBtnTextDisabled,
                    ]}
                  >
                    SAVE CHANGES
                  </Text>
                </>
              )}
            </Pressable>
            {footerCaption ? (
              <Text style={styles.footerCaption}>{footerCaption}</Text>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
