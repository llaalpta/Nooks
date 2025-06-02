import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';
// Snap points como porcentajes de la pantalla
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
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.l,
      borderTopRightRadius: theme.borderRadius.l,
      ...theme.elevation.level3,
    },
    draggableHeader: {
      // Solo el header es arrastrable
      backgroundColor: theme.colors.surface,
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
      // Asegura que la lista ocupe todo el espacio restante
    },
    listContent: {
      paddingBottom: theme.spacing.l,
      // FORZAR scroll: hace que el contentSize sea siempre mayor que la altura del container
      minHeight: '120%', // El contenido será 20% más alto que el container
    },
    forcedScrollSpace: {
      // Espacio adicional al final para garantizar scroll
      height: 100,
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
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
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
