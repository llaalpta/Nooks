import { StyleSheet } from 'react-native';

import { AppColors } from '@/types/colors';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      overflow: 'hidden',
    },
    cardHorizontalContainer: {
      flexDirection: 'row',
      height: 140,
    },
    imageContainer: {
      width: '35%', // 1/4 del ancho total
      height: '100%',
    },
    horizontalImage: {
      width: '100%',
      height: '100%',
    },
    horizontalPlaceholder: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardContent: {
      flex: 1,
      padding: 16,
      paddingRight: 8, // Menos padding a la derecha para hacer espacio a las acciones
    },
    actionsHorizontal: {
      position: 'absolute',
      top: 8,
      right: 8,
      flexDirection: 'row',
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.onSurface,
      marginBottom: 4,
    },
    description: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      marginBottom: 8,
    },
    locationInfo: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      marginBottom: 4,
      fontStyle: 'italic',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    tag: {
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginRight: 8,
      marginBottom: 4,
    },
    tagText: {
      fontSize: 12,
      fontWeight: '500',
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: 8,
    },
  });
