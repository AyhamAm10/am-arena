import { PropsWithChildren, useMemo, useRef } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { useMirror, useMirrorRegistry } from './store'
import { uploadImageToCloudinary } from '@/src/lib/cloudinary/upload-image'
import type { AuthRegisterBody } from '@/src/api/types/auth.types'

function Utils({ children }: PropsWithChildren) {
  const submit = useMirror('submit')
  const isLoading = useMirror('isLoading')
  const phone = useMirror('phone')
  const fullName = useMirror('fullName')
  const gamerName = useMirror('gamerName')
  const email = useMirror('email')
  const password = useMirror('password')
  const confirmPassword = useMirror('confirmPassword')
  const profileImageUri = useMirror('profileImageUri')
  const setProfileImageUri = useMirror('setProfileImageUri')

  const pickedImageRef = useRef<{
    uri: string
    mimeType: string
    fileName: string
  } | null>(null)

  const formError = useMemo(() => {
    if (!profileImageUri) {
      return 'Please upload your profile image.'
    }

    if (!fullName.trim() || !gamerName.trim() || !email.trim() || !password.trim()) {
      return 'Please fill all required fields.'
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match.'
    }

    return null
  }, [profileImageUri, fullName, gamerName, email, password, confirmPassword])

  const canSubmit = useMemo(() => {
    return !isLoading && !formError
  }, [isLoading, formError])

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    })

    if (result.canceled || !result.assets?.length) {
      return
    }

    const asset = result.assets[0]
    pickedImageRef.current = {
      uri: asset.uri,
      mimeType: asset.mimeType ?? 'image/jpeg',
      fileName: asset.fileName ?? 'avatar.jpg',
    }
    setProfileImageUri(asset.uri)
  }

  const onSubmit = async () => {
    if (!canSubmit) return

    const payload: AuthRegisterBody = {
      full_name: fullName.trim(),
      gamer_name: gamerName.trim(),
      email: email.trim(),
      password,
    }
    if (phone.trim()) {
      payload.phone = phone.trim()
    }
    const picked = pickedImageRef.current
    const uploaded = await uploadImageToCloudinary({
      uri: picked?.uri ?? profileImageUri,
      fileName: picked?.fileName ?? 'profile.jpg',
      mimeType: picked?.mimeType ?? 'image/jpeg',
    })
    payload.avatarUrl = uploaded.avatarUrl
    payload.avatarPublicId = uploaded.avatarPublicId

    await submit(payload)
  }

  useMirrorRegistry('formError', formError)
  useMirrorRegistry('canSubmit', canSubmit)
  useMirrorRegistry('pickImage', pickImage, profileImageUri)
  useMirrorRegistry('onSubmit', onSubmit, canSubmit)

  return children
}

export { Utils }
