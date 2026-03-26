import React from 'react'
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { styles } from './styles'
import { colors } from '@/src/theme/colors'
import { useMirror } from './store'

const heroBanner = require('../../assets/Image+Overlay+Shadow.png')

export function Ui() {
  const email = useMirror('email')
  const password = useMirror('password')
  const showPassword = useMirror('showPassword')
  const setEmail = useMirror('setEmail')
  const setPassword = useMirror('setPassword')
  const setShowPassword = useMirror('setShowPassword')

  const canSubmit = useMirror('canSubmit')
  const onSubmit = useMirror('onSubmit')
  const isLoading = useMirror('isLoading')
  const error = useMirror('error')

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps='handled'>
        <Text style={styles.brand}>AM Arena</Text>

        <Image source={heroBanner} style={styles.heroImage} resizeMode='cover' />

        <Text style={styles.welcome}>Welcome Back</Text>
        <Text style={styles.subtitle}>Enter your details to access your arena account</Text>

        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder='name@example.com'
            placeholderTextColor={colors.grey}
            style={styles.input}
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder='********'
            placeholderTextColor={colors.grey}
            style={styles.input}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          onPress={onSubmit}
          disabled={!canSubmit}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
