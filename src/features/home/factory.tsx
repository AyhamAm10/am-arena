import React from 'react'
import { Api } from './api'
import { Ui } from './ui'

export function Factory() {
    return (
        <Api>
            <Ui />
        </Api>
    )
}
