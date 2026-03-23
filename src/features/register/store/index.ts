import { mirrorFactory } from '../../../hooks/use-mirror-factory'
import { ApiState } from './api'
import { RegisterState } from './state'
import { RegisterUtils } from './utils'

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...ApiState(),
  ...RegisterState(),
  ...RegisterUtils(),
})

export { useMirror, useMirrorRegistry }
