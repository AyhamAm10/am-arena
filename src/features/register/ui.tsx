import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { KeyboardAwareScreenScrollView } from '@/src/components/layout'
import { MotionPressable } from '@/src/components/motion'
import { colors } from '@/src/theme/colors'
import { styles } from './styles'
import { useMirror } from './store'

const registerIcon = require('../../assets/register-icon.png')

export function Ui() {
  const phone = useMirror('phone')
  const fullName = useMirror('fullName')
  const gamerName = useMirror('gamerName')
  const country = useMirror('country')
  const email = useMirror('email')
  const password = useMirror('password')
  const confirmPassword = useMirror('confirmPassword')
  const showPassword = useMirror('showPassword')
  const showConfirmPassword = useMirror('showConfirmPassword')

  const setPhone = useMirror('setPhone')
  const setFullName = useMirror('setFullName')
  const setGamerName = useMirror('setGamerName')
  const setCountry = useMirror('setCountry')
  const setEmail = useMirror('setEmail')
  const setPassword = useMirror('setPassword')
  const setConfirmPassword = useMirror('setConfirmPassword')
  const setShowPassword = useMirror('setShowPassword')
  const setShowConfirmPassword = useMirror('setShowConfirmPassword')

  const onSubmit = useMirror('onSubmit')
  const pickImage = useMirror('pickImage')
  const canSubmit = useMirror('canSubmit')
  const formError = useMirror('formError')
  const apiError = useMirror('error')
  const isLoading = useMirror('isLoading')
  const profileImageUri = useMirror('profileImageUri')

  // Local state to preserve native cursor behavior during typing
  const [phoneLocal, setPhoneLocal] = useState(phone)
  const [fullNameLocal, setFullNameLocal] = useState(fullName)
  const [gamerNameLocal, setGamerNameLocal] = useState(gamerName)
  const [countryLocal, setCountryLocal] = useState(country)
  const [emailLocal, setEmailLocal] = useState(email)
  const [passwordLocal, setPasswordLocal] = useState(password)
  const [confirmPasswordLocal, setConfirmPasswordLocal] = useState(confirmPassword)

  // Keep locals in sync if external store changes
  useEffect(() => setPhoneLocal(phone), [phone])
  useEffect(() => setFullNameLocal(fullName), [fullName])
  useEffect(() => setGamerNameLocal(gamerName), [gamerName])
  useEffect(() => setCountryLocal(country), [country])
  useEffect(() => setEmailLocal(email), [email])
  useEffect(() => setPasswordLocal(password), [password])
  useEffect(() => setConfirmPasswordLocal(confirmPassword), [confirmPassword])

  return (
    <KeyboardAwareScreenScrollView style={styles.root} contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Text style={styles.title}>انضم إلى الساحة</Text>
        </View>

        <View style={styles.iconWrap}>
          <TouchableOpacity style={styles.iconButton} onPress={pickImage} activeOpacity={0.85}>
            <Image
              source={profileImageUri ? { uri: profileImageUri } : registerIcon}
              style={styles.icon}
              resizeMode='cover'
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>ارفع صورة شخصية لتظهر في لوحة المتصدرين</Text>

        <Text style={styles.label}>رقم الهاتف</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={phoneLocal}
            onChangeText={setPhoneLocal}
            onBlur={() => setPhone(phoneLocal)}
            placeholder="05xxxxxxxx"
            placeholderTextColor={colors.grey}
            style={[styles.input, { textAlign: phoneLocal.length > 0 ? 'left' : 'right', writingDirection: 'ltr' }]}
            keyboardType='phone-pad'
          />
        </View>

        <Text style={styles.label}>الاسم الكامل</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={fullNameLocal}
            onChangeText={setFullNameLocal}
            onBlur={() => setFullName(fullNameLocal)}
            placeholder="أدخل اسمك الكامل"
            placeholderTextColor={colors.grey}
            style={[styles.input, { textAlign: fullNameLocal.length > 0 ? 'left' : 'right', writingDirection: 'ltr' }]}
          />
        </View>

        <Text style={styles.label}>اسم اللاعب</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={gamerNameLocal}
            onChangeText={setGamerNameLocal}
            onBlur={() => setGamerName(gamerNameLocal)}
            placeholder="اسمك في اللعبة"
            placeholderTextColor={colors.grey}
            style={[styles.input, { textAlign: gamerNameLocal.length > 0 ? 'left' : 'right', writingDirection: 'ltr' }]}
            autoCapitalize='none'
          />
        </View>

        <Text style={styles.label}>الدولة</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={countryLocal}
            onChangeText={setCountryLocal}
            onBlur={() => setCountry(countryLocal)}
            placeholder="أدخل الدولة"
            placeholderTextColor={colors.grey}
            style={[styles.input, { textAlign: countryLocal.length > 0 ? 'left' : 'right', writingDirection: 'ltr' }]}
          />
        </View>

        <Text style={styles.label}>البريد الإلكتروني</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={emailLocal}
            onChangeText={setEmailLocal}
            onBlur={() => setEmail(emailLocal)}
            placeholder="أدخل بريدك الإلكتروني"
            placeholderTextColor={colors.grey}
            style={[styles.input, { textAlign: emailLocal.length > 0 ? 'left' : 'right', writingDirection: 'ltr' }]}
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
          />
        </View>

        <Text style={styles.label}>كلمة المرور</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={passwordLocal}
            onChangeText={setPasswordLocal}
            onBlur={() => setPassword(passwordLocal)}
            placeholder="••••••"
            placeholderTextColor={colors.grey}
            style={[styles.input, { textAlign: passwordLocal.length > 0 ? 'left' : 'right', writingDirection: 'ltr' }]}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.toggleText}>{showPassword ? "إخفاء" : "إظهار"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>تأكيد كلمة المرور</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={confirmPasswordLocal}
            onChangeText={setConfirmPasswordLocal}
            onBlur={() => setConfirmPassword(confirmPasswordLocal)}
            placeholder="••••••"
            placeholderTextColor={colors.grey}
            style={[styles.input, { textAlign: confirmPasswordLocal.length > 0 ? 'left' : 'right', writingDirection: 'ltr' }]}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Text style={styles.toggleText}>{showConfirmPassword ? "إخفاء" : "إظهار"}</Text>
          </TouchableOpacity>
        </View>

        {formError ? <Text style={styles.helperError}>{formError}</Text> : null}
        {apiError ? <Text style={styles.helperError}>{apiError}</Text> : null}

        <MotionPressable
          style={[styles.button, (!canSubmit || isLoading) && styles.buttonDisabled]}
          onPress={onSubmit}
          disabled={!canSubmit || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>إنشاء حساب</Text>
          )}
        </MotionPressable>
    </KeyboardAwareScreenScrollView>
  )
}
