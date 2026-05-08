import React, { useState, useEffect } from 'react'
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import { KeyboardAwareScreenScrollView } from '@/src/components/layout'
import { MotionPressable } from '@/src/components/motion'
import { styles } from './styles'
import { colors } from '@/src/theme/colors'
import { useMirror } from './store'

const heroBanner = require('../../assets/Image+Overlay+Shadow.png')

export function Ui() {
  const router = useRouter()
  const email = useMirror('email')
  const password = useMirror('password')
  const showPassword = useMirror('showPassword')
  const setEmail = useMirror('setEmail')
  const setPassword = useMirror('setPassword')
  const setShowPassword = useMirror('setShowPassword')

  // Local state to preserve native cursor behavior during typing
  const [emailLocal, setEmailLocal] = useState(email)
  const [passwordLocal, setPasswordLocal] = useState(password)

  // Keep locals in sync if external store changes
  useEffect(() => setEmailLocal(email), [email])
  useEffect(() => setPasswordLocal(password), [password])

  const canSubmit = useMirror('canSubmit')
  const onSubmit = useMirror('onSubmit')
  const isLoading = useMirror('isLoading')
  const error = useMirror('error')

  return (
    <KeyboardAwareScreenScrollView style={styles.root} contentContainerStyle={styles.content}>
        <Text style={styles.brand}>AM ARENA</Text>

        <Image source={heroBanner} style={styles.heroImage} resizeMode='cover' />

        <Text style={styles.welcome}>أهلاً بعودتك</Text>
        <Text style={styles.subtitle}>أدخل بياناتك للوصول إلى حسابك في الساحة</Text>

        <Text style={styles.label}>البريد الإلكتروني</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={emailLocal}
            onChangeText={setEmailLocal}
            onBlur={() => setEmail(emailLocal)}
            placeholder="username@gmail.com"
            placeholderTextColor={colors.grey}
            style={[styles.input, { textAlign: 'left' }]}
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
            placeholder="••••••••"
            placeholderTextColor={colors.grey}
            style={[styles.input, { textAlign: 'right' }]}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.toggleText}>{showPassword ? "إخفاء" : "إظهار"}</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <MotionPressable
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          onPress={onSubmit}
          disabled={!canSubmit}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>تسجيل الدخول</Text>
          )}
        </MotionPressable>

        <View style={styles.registerFooter}>
          <Text style={styles.registerPrompt}>
            ليس لديك حساب؟{' '}
            <Text
              style={styles.registerLink}
              onPress={() => router.push('/register')}
            >
              إنشاء حساب
            </Text>
          </Text>
        </View>
    </KeyboardAwareScreenScrollView>
  )
}
