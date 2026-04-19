import React, { PropsWithChildren } from 'react'
import { useMirrorRegistry } from './store'
import { InitTopBarState } from './store/init'

export function Init(props: PropsWithChildren<InitTopBarState>) {
    const { type, children, avatarSource, level, levelProgress, coins, achievementColor, achievementIconUrl, achievementName } = props
    useMirrorRegistry("type", type)
    useMirrorRegistry("avatarSource", avatarSource)
    useMirrorRegistry("level", level)
    useMirrorRegistry("levelProgress", levelProgress)
    useMirrorRegistry("coins", coins)
    useMirrorRegistry("achievementColor", achievementColor)
    useMirrorRegistry("achievementIconUrl", achievementIconUrl)
    useMirrorRegistry("achievementName", achievementName)

    return (
        <>
            {children}
        </>
    )
}
