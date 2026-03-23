  type LoginState = {
  email: string
  password: string
  showPassword: boolean
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  setShowPassword: (showPassword: boolean) => void
}

const store = (): LoginState => ({
  email: '',
  password: '',
  showPassword: false,
  setEmail: () => {},
  setPassword: () => {},
  setShowPassword: () => {},
})

export { store as LoginState }
export type { LoginState as LoginStateType }
