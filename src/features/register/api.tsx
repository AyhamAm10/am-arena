import { useRegisterUser } from '@/src/hooks/api/auth/useRegisterUser'
import type { AuthRegisterBody } from '@/src/api/types/auth.types'
import { PropsWithChildren } from 'react'
import { useMirrorRegistry } from './store'

function Api({ children }: PropsWithChildren) {
  const { mutateAsync, isPending, error } = useRegisterUser()

  const submit = async (body: AuthRegisterBody) => {
    await mutateAsync(body)
  }

  useMirrorRegistry('submit', submit, mutateAsync)
  useMirrorRegistry('isLoading', isPending, isPending)
  useMirrorRegistry('error', error?.message ?? null, error?.message)

  return children
}

export { Api }
