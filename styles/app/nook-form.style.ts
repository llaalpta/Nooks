import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.m,
      paddingTop: theme.spacing.s,
      paddingBottom: theme.spacing.m,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outlineVariant,
      ...theme.elevation.level1,
    },
    headerTitle: {
      flex: 1,
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.onSurface,
      textAlign: 'center',
    },
    mapCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.spacing.l,
      overflow: 'hidden',
      marginBottom: theme.spacing.l,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },
    map: {
      height: 300,
      borderRadius: theme.spacing.l,
      overflow: 'hidden',
    },
    mapButton: {
      position: 'relative',
      backgroundColor: theme.colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      borderRadius: theme.spacing.s,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    mapButtonText: {
      color: theme.colors.onPrimary,
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 4,
      letterSpacing: 0.5,
    },
    coordsText: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 16,
    },
    realmButton: {
      marginVertical: 8,
    },
    mapSection: {
      marginBottom: 16,
    },
    mapButtonContainer: {
      position: 'absolute',
      top: 12,
      right: 12,
      zIndex: 10,
    },
    coordsContainer: {
      backgroundColor: theme.colors.surfaceVariant,
      padding: theme.spacing.s,
      borderRadius: theme.spacing.s,
      marginBottom: theme.spacing.s,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    formContainer: {
      padding: theme.spacing.m,
      paddingBottom: theme.spacing.xl,
    },
    formSection: {
      marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.m,
    },
    sectionIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primaryContainer,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.m,
    },
    sectionTextContainer: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.xs,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 20,
    },
    sectionContent: {},
    formControl: {
      marginBottom: theme.spacing.xs,
    },
    inputContainer: {
      marginBottom: theme.spacing.m,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.s,
    },
    error: {
      color: theme.colors.error,
      fontSize: 12,
      lineHeight: 16,
      marginTop: theme.spacing.xs,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.l,
    },
    button: {
      flex: 1,
      marginHorizontal: theme.spacing.s,
    },
    cancelButton: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    cancelButtonText: {
      color: theme.colors.onSurfaceVariant,
    },
    actionContainer: {
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.l,
      gap: theme.spacing.m,
    },
    connectionWarning: {
      backgroundColor: theme.colors.errorContainer,
      padding: theme.spacing.m,
      borderRadius: theme.spacing.s,
      flexDirection: 'row',
      alignItems: 'center',
    },
    connectionWarningText: {
      color: theme.colors.onErrorContainer,
      marginLeft: theme.spacing.s,
      flex: 1,
      fontSize: 14,
    },
    primaryButton: {
      borderRadius: theme.spacing.s,
      ...theme.elevation.level1,
    },
    secondaryButton: {
      borderRadius: theme.spacing.s,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    loadingButton: {
      opacity: 0.7,
    },
    inputSpacing: {
      marginBottom: theme.spacing.m,
    },
    inputSpacingLast: {
      marginBottom: 0,
    },
  });
