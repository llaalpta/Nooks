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
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.onSurface,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 16,
      color: colors.onSurfaceVariant,
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
      top: 16,
      right: 16,
      zIndex: 1,
    },
    locationButton: {
      backgroundColor: colors.surface,
      elevation: 4,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    realmsButtonContainer: {
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 1,
    },
    realmsButton: {
      backgroundColor: colors.surface,
      elevation: 4,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    calloutContainer: {
      minWidth: 200,
      maxWidth: 250,
      padding: 12,
    },
    calloutTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.onSurface,
      marginBottom: 4,
    },
    calloutDescription: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      marginBottom: 4,
    },
    calloutRadius: {
      fontSize: 12,
      color: colors.primary,
      marginBottom: 4,
    },
    calloutAction: {
      fontSize: 12,
      color: colors.primary,
      fontStyle: 'italic',
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: colors.primary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    errorText: {
      fontSize: 16,
      color: colors.error,
      textAlign: 'center',
      marginBottom: 16,
    },
  });
