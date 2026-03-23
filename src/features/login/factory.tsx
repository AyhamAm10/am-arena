import React from 'react'
import { Api } from './api'
import { Ui } from './ui'
import { State } from './state'
import { Utils } from './utils'

export function Factory() {
  return (
    <Api>
      <Utils>
        <State>
          <Ui />
        </State>
      </Utils>
    </Api>
  )
}
