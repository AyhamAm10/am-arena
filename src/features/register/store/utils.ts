type RegisterUtils = {
  canSubmit: boolean
  formError: string | null
  pickImage: () => Promise<void>
  onSubmit: () => Promise<void>
}

const store = (): RegisterUtils => ({
  canSubmit: false,
  formError: null,
  pickImage: async () => {},
  onSubmit: async () => {},
})

export { store as RegisterUtils }
export type { RegisterUtils as RegisterUtilsType }
