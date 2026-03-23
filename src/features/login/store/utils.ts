type LoginUtils = {
    canSubmit: boolean
    onSubmit: () => Promise<void>
}

const store = (): LoginUtils => ({
    canSubmit: false,
    onSubmit: async () => {},
})

export { store as LoginUtils }
export type { LoginUtils as LoginUtilsType }
