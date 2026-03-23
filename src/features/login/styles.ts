import { StyleSheet } from 'react-native'
import { colors } from '@/src/theme/colors'

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.darkBackground1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 24,
  },
  brand: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: 170,
    borderRadius: 24,
    marginBottom: 28,
  },
  welcome: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.grey,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
  },
  label: {
    color: colors.white,
    fontSize: 14,
    marginBottom: 10,
    marginTop: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkBackground2,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#3a2451',
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 52,
    color: colors.white,
    fontSize: 15,
  },
  toggleText: {
    color: colors.grey,
    fontSize: 13,
    fontWeight: '600',
  },
  errorText: {
    color: colors.error,
    marginTop: 10,
    marginBottom: 8,
  },
  button: {
    marginTop: 18,
    backgroundColor: colors.primaryPurple,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
})
