type ApiState = {
  submit: (body: FormData) => Promise<void>
  isLoading: boolean
  error: string | null
}

const store = (): ApiState => ({
  submit: async () => {},
  isLoading: false,
  error: null,
})

export { store as ApiState }
export type { ApiState as ApiRegisterState }
