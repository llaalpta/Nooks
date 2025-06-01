import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.m, // 16dp
      paddingVertical: theme.spacing.m, // 16dp
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outlineVariant,
    },
    headerTitle: {
      fontSize: 24, // headlineSmall según MD3
      fontWeight: '400',
      lineHeight: 32,
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.xs, // 4dp
    },
    headerSubtitle: {
      fontSize: 16, // bodyLarge según MD3
      lineHeight: 24,
      color: theme.colors.onSurfaceVariant,
    },
    mapContainer: {
      flex: 1,
      position: 'relative',
    },
    map: {
      flex: 1,
    },
    locationButtonContainer: {
      position: 'absolute',
      top: theme.spacing.m, // 16dp
      right: theme.spacing.m, // 16dp
      zIndex: 1,
    },
    locationButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.m, // 12dp
      ...theme.elevation.level2, // Elevación consistente MD3
    },
    realmsButtonContainer: {
      position: 'absolute',
      right: theme.spacing.m, // 16dp
      bottom: theme.spacing.xl, // Por encima del FAB
      zIndex: 1,
    },
    realmsButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.s, // 8dp
      ...theme.elevation.level2, // Sombra para botón
    },
    calloutContainer: {
      minWidth: 200,
      maxWidth: 250,
      padding: theme.spacing.sm, // 12dp
    },
    calloutTitle: {
      fontSize: 16, // bodyLarge según MD3
      fontWeight: '600',
      lineHeight: 24,
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.xs, // 4dp
    },
    calloutDescription: {
      fontSize: 14, // bodyMedium según MD3
      lineHeight: 20,
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.spacing.xs, // 4dp
    },
    calloutRadius: {
      fontSize: 12, // bodySmall según MD3
      lineHeight: 16,
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs, // 4dp
    },
    calloutAction: {
      fontSize: 12, // bodySmall según MD3
      lineHeight: 16,
      color: theme.colors.primary,
      fontStyle: 'italic',
    },
    fab: {
      position: 'absolute',
      margin: theme.spacing.m, // 16dp
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.m, // 12dp
      ...theme.elevation.level3, // Elevación para FAB
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.l, // 24dp
    },
    errorText: {
      fontSize: 16, // bodyLarge según MD3
      lineHeight: 24,
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.m, // 16dp
    },
  });
