import { StyleSheet, Dimensions } from 'react-native';

import { AppTheme } from '@/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'box-none',
    },
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: SCREEN_HEIGHT,
      backgroundColor: theme.colors.surfaceContainerHigh,
      borderTopLeftRadius: theme.borderRadius.l,
      borderTopRightRadius: theme.borderRadius.l,
      ...theme.elevation.level3,
    },
    draggableHeader: {
      backgroundColor: theme.colors.surfaceContainerHigh,
      borderTopLeftRadius: theme.borderRadius.l,
      borderTopRightRadius: theme.borderRadius.l,
    },
    handle: {
      alignItems: 'center',
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
    },
    handleBar: {
      width: 60,
      height: 4,
      borderRadius: 2,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outlineVariant,
    },
    title: {
      fontSize: 18,
      fontWeight: '500',
      color: theme.colors.onSurface,
    },
    closeButton: {
      padding: theme.spacing.xs,
    },

    listContainer: {
      flex: 1,
      paddingBottom: theme.spacing.s, // Añadir padding para evitar que el contenido se corte
    },
    listContent: {
      paddingHorizontal: 0,
      paddingTop: theme.spacing.xs,
      paddingBottom: theme.spacing.m, // Aumentar padding bottom significativamente
      flexGrow: 1, // Cambiar de minHeight a flexGrow
    },
    forcedScrollSpace: {
      height: 200, // Aumentar significativamente el espacio de scroll forzado
      backgroundColor: 'transparent',
    },
    realmItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.surfaceVariant,
    },
    realmIconContainer: {
      marginRight: theme.spacing.m,
    },
    realmIcon: {
      width: 32,
      height: 32,
    },
    realmInfo: {
      flex: 1,
    },
    realmName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.onSurface,
      marginBottom: 4,
    },
    realmAddress: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
    },
    realmActions: {
      alignItems: 'flex-end',
    },
    realmDistance: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    detailsButton: {
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    detailsButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.primary,
    },
  });
