type RegisterState = {
  phone: string
  fullName: string
  gamerName: string
  country: string
  email: string
  password: string
  confirmPassword: string
  showPassword: boolean
  showConfirmPassword: boolean
  profileImageUri: string
  setPhone: (phone: string) => void
  setFullName: (fullName: string) => void
  setGamerName: (gamerName: string) => void
  setCountry: (country: string) => void
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  setConfirmPassword: (confirmPassword: string) => void
  setShowPassword: (showPassword: boolean) => void
  setShowConfirmPassword: (showConfirmPassword: boolean) => void
  setProfileImageUri: (profileImageUri: string) => void
}

const store = (): RegisterState => ({
  phone: '',
  fullName: '',
  gamerName: '',
  country: '',
  email: '',
  password: '',
  confirmPassword: '',
  showPassword: false,
  showConfirmPassword: false,
  profileImageUri: '',
  setPhone: () => {},
  setFullName: () => {},
  setGamerName: () => {},
  setCountry: () => {},
  setEmail: () => {},
  setPassword: () => {},
  setConfirmPassword: () => {},
  setShowPassword: () => {},
  setShowConfirmPassword: () => {},
  setProfileImageUri: () => {},
})

export { store as RegisterState }
export type { RegisterState as RegisterStateType }
