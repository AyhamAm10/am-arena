import { useRegisterUser } from '@/src/hooks/api/auth/useRegisterUser'
import { PropsWithChildren } from 'react'
import { useMirrorRegistry } from './store'

function Api({ children }: PropsWithChildren) {
  const { mutateAsync, isPending, error } = useRegisterUser()

  const submit = async (body: FormData) => {
    await mutateAsync(body)
  }

  useMirrorRegistry('submit', submit, mutateAsync)
  useMirrorRegistry('isLoading', isPending, isPending)
  useMirrorRegistry('error', error?.message ?? null, error?.message)

  return children
}

export { Api }
