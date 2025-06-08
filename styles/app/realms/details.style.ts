import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme, insets: { top: number }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    // Espaciador para el header fijo
    headerSpacer: {
      height: insets.top + 56 + 8,
    },
    // Imagen principal
    imageContainer: {
      height: 280,
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
      borderTopLeftRadius: theme.borderRadius.l,
      borderTopRightRadius: theme.borderRadius.l,
    },
    placeholderImage: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    // Contenido principal con efecto overlay
    contentContainer: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.l,
      borderTopRightRadius: theme.borderRadius.l,
      marginTop: -24,
      paddingTop: theme.spacing.l,
      paddingHorizontal: theme.spacing.l,
      flex: 1,
    },
    header: {
      marginBottom: theme.spacing.l,
    },
    headerTitle: {
      fontSize: 28,
      lineHeight: 36, // Añadir esta línea
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.s,
    },
    description: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 24,
    },
    location: {
      marginLeft: theme.spacing.s,
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
    },
    tagsContainer: {
      marginTop: theme.spacing.m,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.s,
    },
    tag: {
      backgroundColor: theme.colors.primaryContainer,
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      borderRadius: theme.borderRadius.m,
    },
    tagText: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.onPrimaryContainer,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline + '20',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.onSurface,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primaryContainer,
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      borderRadius: theme.borderRadius.s,
      gap: 6,
    },
    addButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.onPrimaryContainer,
    },
    // Cards de nooks
    nookCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.m,
      padding: theme.spacing.l,
      marginHorizontal: theme.spacing.m,
      marginBottom: theme.spacing.m,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      ...theme.elevation.level2,
    },
    nookTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.s,
    },
    nookDescription: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 20,
    },
    // Estado vacío
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xl,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      marginBottom: theme.spacing.l,
      lineHeight: 24,
    },
    listFooter: {
      height: 80,
    },
    nooksCard: {
      marginHorizontal: theme.spacing.m,

      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.m,
      borderRadius: theme.spacing.m,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...theme.elevation.level2, // Elevación para destacar
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },
    nooksTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    nooksCounter: {
      backgroundColor: theme.colors.primaryContainer,
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.spacing.l,
      minWidth: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },

    nooksCounterText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.onPrimaryContainer,
    },

    nooksTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.onSurface,
      marginRight: theme.spacing.s,
    },
  });
