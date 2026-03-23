import { useLoginUser } from '@/src/hooks/api/auth/useLoginUser'
import type { AuthLoginBody } from '@/src/api/types/auth.types'
import { PropsWithChildren } from 'react'
import { useMirrorRegistry } from './store'

function Api({ children }: PropsWithChildren) {
  const { mutateAsync, isPending, error } = useLoginUser()

  const submit = async (body: AuthLoginBody) => {
    await mutateAsync(body)
  }

  useMirrorRegistry('submit', submit, mutateAsync)
  useMirrorRegistry('isLoading', isPending, isPending)
  useMirrorRegistry('error', error?.message ?? null, error?.message)

  return children
}

export { Api }
