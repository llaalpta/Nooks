import { StyleSheet } from 'react-native';

import { AppColors } from '@/types/colors';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.onSurface,
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.onSurface,
      marginVertical: 12,
      paddingHorizontal: 16,
    },
    cardList: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.onSurface,
      marginBottom: 8,
    },
    cardSubtitle: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      marginBottom: 12,
    },
    emptyContainer: {
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      height: 200,
    },
    emptyText: {
      color: colors.onSurfaceVariant,
      textAlign: 'center',
    },
    buttonContainer: {
      marginTop: 12,
    },
  });
