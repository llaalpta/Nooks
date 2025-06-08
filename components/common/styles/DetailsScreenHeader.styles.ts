import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.primaryContainer,
      ...theme.elevation.level1,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.sm,
      minHeight: 62,
    },
    backButton: {
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.s,
      marginRight: theme.spacing.s,
    },
    titleContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.onSurface,
      textAlign: 'center',
      width: '100%',
    },
    optionsButton: {
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.s,
      marginLeft: theme.spacing.s,
    },
    placeholder: {
      width: 40,
    },
    optionsMenu: {
      position: 'absolute',
      top: 62 + theme.spacing.sm, // Removido insets.top porque ya está aplicado al container
      right: theme.spacing.m,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.m,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      ...theme.elevation.level3,
      minWidth: 180,
      paddingVertical: 8,
      zIndex: 1001, // Asegurar que esté por encima del header
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.m,
      gap: 12,
    },
    optionText: {
      fontSize: 16,
      color: theme.colors.onSurface,
      flex: 1,
    },
  });
