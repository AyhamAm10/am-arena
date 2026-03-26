import { PropsWithChildren, useMemo } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { useMirror, useMirrorRegistry } from './store'

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
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    })

    if (result.canceled || !result.assets?.length) {
      return
    }

    setProfileImageUri(result.assets[0].uri)
  }

  const onSubmit = async () => {
    if (!canSubmit) return

    const payload = new FormData()
    payload.append('full_name', fullName.trim())
    payload.append('gamer_name', gamerName.trim())
    payload.append('email', email.trim())
    payload.append('password', password)
    if (phone.trim()) {
      payload.append('phone', phone.trim())
    }
    payload.append('profile_picture', {
      uri: profileImageUri,
      name: 'profile-image.jpg',
      type: 'image/jpeg',
    } as any)

    await submit(payload)
  }

  useMirrorRegistry('formError', formError)
  useMirrorRegistry('canSubmit', canSubmit)
  useMirrorRegistry('pickImage', pickImage, profileImageUri)
  useMirrorRegistry('onSubmit', onSubmit, canSubmit)

  return children
}

export { Utils }
