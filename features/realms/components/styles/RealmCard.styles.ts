import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.s, // 8dp según MD3
      marginBottom: theme.spacing.m, // 16dp
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      overflow: 'hidden',
      ...theme.elevation.level1, // Elevación sutil para cards
    },
    cardHorizontalContainer: {
      flexDirection: 'row',
      height: 140,
    },
    imageContainer: {
      width: 120, // Fijo para evitar deformaciones
      height: '100%',
      borderTopLeftRadius: theme.borderRadius.s,
      borderBottomLeftRadius: theme.borderRadius.s,
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceVariant,
    },
    horizontalImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover', // Importante para evitar deformación
    },
    horizontalPlaceholder: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopLeftRadius: theme.borderRadius.s,
      borderBottomLeftRadius: theme.borderRadius.s,
    },
    cardContent: {
      flex: 1,
      padding: theme.spacing.m, // 16dp
      paddingRight: theme.spacing.s, // 8dp
    },
    actionsHorizontal: {
      position: 'absolute',
      top: theme.spacing.s, // 8dp
      right: theme.spacing.s, // 8dp
      flexDirection: 'row',
    },
    title: {
      fontSize: 18, // titleMedium sería 16, pero mantenemos 18 para jerarquía
      fontWeight: '500',
      lineHeight: 24,
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.xs, // 4dp
    },
    description: {
      fontSize: 14, // bodyMedium según MD3
      lineHeight: 20,
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.spacing.s, // 8dp
    },
    locationInfo: {
      fontSize: 12, // bodySmall según MD3
      lineHeight: 16,
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.spacing.xs, // 4dp
      fontStyle: 'italic',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.xs, // Menos margen superior entre contenido y etiquetas
    },
    tag: {
      borderRadius: theme.borderRadius.xs, // 4dp para tags pequeños
      paddingHorizontal: theme.spacing.s, // 8dp
      paddingVertical: 2,
      marginRight: theme.spacing.s, // 8dp
      marginBottom: theme.spacing.xs, // 4dp
    },
    tagText: {
      fontSize: 12, // labelMedium según MD3
      lineHeight: 16,
      fontWeight: '500',
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: theme.spacing.s, // 8dp
    },
  });
