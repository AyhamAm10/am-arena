import { StyleSheet } from 'react-native'
import { colors } from '@/src/theme/colors'

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0c0715',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  topBar: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '800',
  },
  iconWrap: {
    alignItems: 'center',
    marginBottom: 18,
  },
  iconButton: {
    width: 164,
    height: 164,
    borderRadius: 82,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#4b1f86',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1030',
    shadowColor: '#7025f6',
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 14,
  },
  icon: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  subtitle: {
    color: colors.white,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  label: {
    color: colors.white,
    fontSize: 14,
    marginBottom: 8,
    marginTop: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0f2a',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2b1842',
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 52,
    color: colors.white,
    fontSize: 15,
  },
  toggleText: {
    color: colors.grey,
    fontSize: 12,
    fontWeight: '600',
  },
  helperError: {
    color: colors.error,
    marginTop: 4,
    marginBottom: 6,
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.primaryPurple,
    height: 54,
    borderRadius: 27,
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
