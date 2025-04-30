import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 24,
    },
    title: {
      marginBottom: 24,
      textAlign: 'center',
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.onSurface,
    },
    button: {
      marginTop: 16,
    },
    textButton: {
      marginTop: 8,
    },
  });
