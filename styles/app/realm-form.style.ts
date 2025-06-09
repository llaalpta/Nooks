import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    formContainer: {
      padding: theme.spacing.m,
      paddingBottom: theme.spacing.xl,
    },
    header: {
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.m,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outlineVariant,
      ...theme.elevation.level1,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '600',
      lineHeight: 36,
      color: theme.colors.onSurface,
      textAlign: 'center',
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
    sectionTitleOld: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 24,
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.sm,
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

export const createImagePickerStyles = (theme: AppTheme) =>
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
      marginBottom: theme.spacing.m,
    },
    imagePreview: {
      position: 'relative',
      marginBottom: theme.spacing.m,
    },
    image: {
      width: '100%',
      aspectRatio: 16 / 9,
      maxWidth: 300,
      maxHeight: 200,
      borderRadius: theme.borderRadius.m,
      backgroundColor: theme.colors.surfaceVariant,
    },
    imageOverlay: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 6,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    placeholderContainer: {
      width: '100%',
      aspectRatio: 16 / 9,
      maxWidth: 300,
      maxHeight: 200,
      borderRadius: theme.borderRadius.m,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: theme.colors.outline,
      backgroundColor: theme.colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.m,
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
      borderRadius: theme.borderRadius.s,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    changeButton: {
      borderRadius: theme.borderRadius.s,
      backgroundColor: theme.colors.primaryContainer,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
  });

export const createMapPickerStyles = (theme: AppTheme) =>
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
    mapContainer: {
      height: 250,
      borderRadius: theme.borderRadius.m,
      overflow: 'hidden',
      marginBottom: theme.spacing.m,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    topRightButton: {
      position: 'absolute',
      top: theme.spacing.s,
      right: theme.spacing.s,
      zIndex: 1000,
    },
    mapButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      borderRadius: theme.borderRadius.s,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    mapButtonLoading: {
      backgroundColor: theme.colors.primaryContainer,
    },
    mapButtonText: {
      color: theme.colors.onPrimary,
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 4,
      letterSpacing: 0.5,
    },
    sliderContainer: {
      marginBottom: theme.spacing.m,
    },
    sliderLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.onSurface,
      textAlign: 'center',
      marginBottom: theme.spacing.s,
    },
    slider: {
      width: '100%',
      height: 40,
      marginBottom: theme.spacing.xs,
    },
    sliderLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.s,
    },
    sliderRangeLabel: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
    },
    coordsText: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      backgroundColor: theme.colors.surfaceVariant,
      padding: theme.spacing.s,
      borderRadius: theme.borderRadius.s,
      lineHeight: 16,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
  });
