import type { AuthLoginBody } from '@/src/api/types/auth.types'

type ApiState = {
  submit: (body: AuthLoginBody) => Promise<void>
  isLoading: boolean
  error: string | null
}

const store = (): ApiState => ({
  submit: async () => {},
  isLoading: false,
  error: null,
})

export { store as ApiState }
export type { ApiState as ApiLoginState }
