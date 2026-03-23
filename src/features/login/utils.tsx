import { PropsWithChildren, useMemo } from 'react'
import { useMirror, useMirrorRegistry } from './store'

function Utils({ children }: PropsWithChildren) {
 
    const email = useMirror('email')
    const password = useMirror('password')
    const isLoading = useMirror('isLoading')
    const submit = useMirror('submit')

    const canSubmit = useMemo(() => {
        return email.trim().length > 0 && password.trim().length > 0 && !isLoading
    }, [email, password, isLoading])

    const onSubmit = async () => {
        if (!canSubmit) return
        await submit({
            email: email.trim(),
            password,
        })
    }
    
    useMirrorRegistry('canSubmit', canSubmit)
    useMirrorRegistry('onSubmit', onSubmit)

    return children
}

export { Utils }
