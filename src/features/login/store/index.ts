import { mirrorFactory } from '../../../hooks/use-mirror-factory'
import { ApiState } from './api'
import { LoginState } from './state'
import { LoginUtils } from './utils'

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...ApiState(),
  ...LoginState(),
  ...LoginUtils(),
})

export { useMirror, useMirrorRegistry }
