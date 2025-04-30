import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    section: {
      marginBottom: 16,
    },
    uploadingText: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
    },
  });
