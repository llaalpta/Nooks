import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    title: {
      marginBottom: 16,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: 16,
    },
    buttonContainer: {
      marginBottom: 16,
    },
  });
