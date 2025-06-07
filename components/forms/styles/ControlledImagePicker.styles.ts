// components/forms/styles/ControlledImagePicker.styles.ts - Versión mejorada
import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    // Estilos originales mantenidos y mejorados
    container: {
      marginBottom: 0, // Manejado por el contenedor padre ahora
    },
    label: {
      marginBottom: theme.spacing.s,
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.onSurfaceVariant,
    },

    // NUEVOS ESTILOS PARA MEJOR UX
    imageContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.xs, // Mucho menor separación con lo siguiente
    },
    imagePreview: {
      position: 'relative',
      marginBottom: 0, // Sin separación extra bajo la imagen
      width: '100%',
      // Elimina alignSelf para que ocupe todo el ancho del padre
    },
    image: {
      width: '100%',
      // La altura la define el aspectRatio en el componente
      borderRadius: theme.spacing.m,
      backgroundColor: theme.colors.surfaceVariant,
    },
    imageOverlay: {
      position: 'absolute',
      top: theme.spacing.s,
      right: theme.spacing.s,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.s,
      ...theme.elevation.level2, // Usando elevación del theme
    },
    placeholderContainer: {
      width: '100%',
      // La altura la define el aspectRatio en el componente
      borderRadius: theme.spacing.m,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: theme.colors.outline,
      backgroundColor: theme.colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.xs, // Mucho menor separación con lo siguiente
      // Elimina alignSelf para que ocupe todo el ancho del padre
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
      borderRadius: theme.spacing.s,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    changeButton: {
      borderRadius: theme.spacing.s,
      backgroundColor: theme.colors.primaryContainer,
    },

    // Estilos originales actualizados
    imagesContainer: {
      marginBottom: theme.spacing.s,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: theme.spacing.xs, // Usando spacing del theme
      textAlign: 'center',
    },
  });
