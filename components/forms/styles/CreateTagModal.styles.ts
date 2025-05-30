import { StyleSheet } from 'react-native';

import { AppColors } from '@/types/colors';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modal: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      width: '100%',
      maxWidth: 400,
      maxHeight: '80%',
    },
    header: {
      padding: 20,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.onSurface,
      textAlign: 'center',
    },
    content: {
      padding: 20,
    },
    colorLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.onSurfaceVariant,
      marginTop: 16,
      marginBottom: 12,
    },
    colorScroll: {
      marginBottom: 16,
    },
    colorContainer: {
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 4,
    },
    colorOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedColor: {
      borderColor: colors.onSurface,
      borderWidth: 3,
    },
    previewContainer: {
      marginTop: 16,
      padding: 12,
      backgroundColor: colors.surfaceVariant,
      borderRadius: 8,
    },
    previewLabel: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      marginBottom: 8,
    },
    previewTag: {
      borderRadius: 16,
      paddingVertical: 6,
      paddingHorizontal: 12,
      alignSelf: 'flex-start',
    },
    previewTagText: {
      color: '#FFFFFF',
      fontWeight: '500',
      fontSize: 14,
    },
    actions: {
      flexDirection: 'row',
      padding: 20,
      paddingTop: 10,
      gap: 12,
    },
    button: {
      flex: 1,
    },
  });
