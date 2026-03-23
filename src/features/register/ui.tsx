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
import { colors } from '@/src/theme/colors'
import { styles } from './styles'
import { useMirror } from './store'

const registerIcon = require('../../assets/register-icon.png')

export function Ui() {
  const phone = useMirror('phone')
  const fullName = useMirror('fullName')
  const gamerName = useMirror('gamerName')
  const email = useMirror('email')
  const password = useMirror('password')
  const confirmPassword = useMirror('confirmPassword')
  const showPassword = useMirror('showPassword')
  const showConfirmPassword = useMirror('showConfirmPassword')

  const setPhone = useMirror('setPhone')
  const setFullName = useMirror('setFullName')
  const setGamerName = useMirror('setGamerName')
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

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps='handled'>
        <View style={styles.topBar}>
          <Text style={styles.title}>Join the Arena</Text>
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

        <Text style={styles.subtitle}>Upload a profile picture for the leaderboards</Text>

        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder='+1(555)000-0000'
            placeholderTextColor={colors.grey}
            style={styles.input}
            keyboardType='phone-pad'
          />
        </View>

        <Text style={styles.label}>Real Name</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder='Enter your full name'
            placeholderTextColor={colors.grey}
            style={styles.input}
          />
        </View>

        <Text style={styles.label}>Gamer Username</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={gamerName}
            onChangeText={setGamerName}
            placeholder='eg. ShadowSlayer99'
            placeholderTextColor={colors.grey}
            style={styles.input}
            autoCapitalize='none'
          />
        </View>

        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder='your@email.com'
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
            placeholder='******'
            placeholderTextColor={colors.grey}
            style={styles.input}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder='******'
            placeholderTextColor={colors.grey}
            style={styles.input}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Text style={styles.toggleText}>{showConfirmPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>

        {formError ? <Text style={styles.helperError}>{formError}</Text> : null}
        {apiError ? <Text style={styles.helperError}>{apiError}</Text> : null}

        <TouchableOpacity
          style={[styles.button, (!canSubmit || isLoading) && styles.buttonDisabled]}
          onPress={onSubmit}
          disabled={!canSubmit || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
