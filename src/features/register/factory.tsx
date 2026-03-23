import React from 'react'
import { Ui } from './ui'
import { Api } from './api'
import { Utils } from './utils'
import { State } from './state'

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
