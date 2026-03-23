import { PropsWithChildren, useState } from 'react'
import { useMirrorRegistry } from './store'

function State({ children }: PropsWithChildren) {
 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    useMirrorRegistry('email', email, setEmail)
    useMirrorRegistry('password', password, setPassword)
    useMirrorRegistry('showPassword', showPassword, setShowPassword)
    useMirrorRegistry('setEmail', setEmail)
    useMirrorRegistry('setPassword', setPassword)
    useMirrorRegistry('setShowPassword', setShowPassword)

  return children
}

export { State }
