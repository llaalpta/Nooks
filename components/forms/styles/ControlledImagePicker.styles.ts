import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: 0,
    },
    label: {
      marginBottom: theme.spacing.s,
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.onSurfaceVariant,
    },

    imageContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    imagePreview: {
      position: 'relative',
      marginBottom: 0,
      width: '100%',
    },
    image: {
      width: '100%',
      borderRadius: theme.spacing.m,
      backgroundColor: theme.colors.surfaceVariant,
    },
    imageOverlay: {
      position: 'absolute',
      top: theme.spacing.s,
      right: theme.spacing.s,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.s,
      ...theme.elevation.level2,
    },
    placeholderContainer: {
      width: '100%',
      borderRadius: theme.spacing.m,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: theme.colors.outline,
      backgroundColor: theme.colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    placeholderContent: {
      alignItems: 'center',
      paddingHorizontal: theme.spacing.m,
    },
    placeholderIcon: {
      marginBottom: theme.spacing.s,
      opacity: 0.6,
    },
    placeholderText: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 20,
    },
    buttonContainer: {
      width: '100%',
      maxWidth: 300,
    },
    addButton: {
      borderRadius: theme.spacing.s,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    changeButton: {
      borderRadius: theme.spacing.s,
      backgroundColor: theme.colors.primaryContainer,
    },

    imagesContainer: {
      marginBottom: theme.spacing.s,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
  });
