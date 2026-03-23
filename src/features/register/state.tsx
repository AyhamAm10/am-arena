import { PropsWithChildren, useState } from 'react'
import { useMirrorRegistry } from './store'

function State({ children }: PropsWithChildren) {
  const [phone, setPhone] = useState('')
  const [fullName, setFullName] = useState('')
  const [gamerName, setGamerName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileImageUri, setProfileImageUri] = useState('')

  useMirrorRegistry('phone', phone, setPhone)
  useMirrorRegistry('fullName', fullName, setFullName)
  useMirrorRegistry('gamerName', gamerName, setGamerName)
  useMirrorRegistry('email', email, setEmail)
  useMirrorRegistry('password', password, setPassword)
  useMirrorRegistry('confirmPassword', confirmPassword, setConfirmPassword)
  useMirrorRegistry('showPassword', showPassword, setShowPassword)
  useMirrorRegistry('showConfirmPassword', showConfirmPassword, setShowConfirmPassword)
  useMirrorRegistry('profileImageUri', profileImageUri, setProfileImageUri)

  useMirrorRegistry('setPhone', setPhone)
  useMirrorRegistry('setFullName', setFullName)
  useMirrorRegistry('setGamerName', setGamerName)
  useMirrorRegistry('setEmail', setEmail)
  useMirrorRegistry('setPassword', setPassword)
  useMirrorRegistry('setConfirmPassword', setConfirmPassword)
  useMirrorRegistry('setShowPassword', setShowPassword)
  useMirrorRegistry('setShowConfirmPassword', setShowConfirmPassword)
  useMirrorRegistry('setProfileImageUri', setProfileImageUri)

  return children
}

export { State }
