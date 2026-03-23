import { AppLayout } from '@/src/components/layout'
import React from 'react'
import { Text, View } from 'react-native'
import { styles } from './styles'

export function Ui() {
    return (
        <AppLayout>
            <View style={styles.placeholder}>
                <Text style={styles.text}>Tournaments</Text>
            </View>
        </AppLayout>
    )
}
