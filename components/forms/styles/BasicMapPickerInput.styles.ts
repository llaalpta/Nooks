// components/forms/styles/BasicMapPickerInput.styles.ts
// Estilos unificados para el mapa básico (sin controles de radio)

import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createBasicMapPickerStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: 0, // Manejado por el contenedor padre
    },
    label: {
      marginBottom: theme.spacing?.s || 8,
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors?.onSurfaceVariant || '#666',
    },
    mapContainer: {
      height: 250, // Altura estándar sin controles de radio
      borderRadius: theme.spacing?.m || 12,
      overflow: 'hidden',
      marginBottom: theme.spacing?.m || 16,
      ...(theme.elevation?.level2 || {}), // Fallback para elevation
      borderWidth: 1,
      borderColor: theme.colors?.outline || '#ccc',
      position: 'relative',
    },
    topLeftButton: {
      position: 'absolute',
      top: theme.spacing?.s || 8,
      left: theme.spacing?.s || 8,
      zIndex: 1000,
      flexDirection: 'column',
      gap: theme.spacing?.s || 8,
    },
    topRightButton: {
      position: 'absolute',
      top: theme.spacing?.s || 8,
      right: theme.spacing?.s || 8,
      zIndex: 1000,
      flexDirection: 'column',
      gap: theme.spacing?.s || 8,
    },
    mapButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors?.primary || '#007AFF',
      paddingHorizontal: theme.spacing?.m || 16,
      paddingVertical: theme.spacing?.s || 8,
      borderRadius: theme.spacing?.s || 8,
      ...(theme.elevation?.level2 || {}), // Fallback para elevation
      minWidth: 120, // Ancho mínimo para consistencia
    },
    mapButtonLoading: {
      backgroundColor: theme.colors?.primaryContainer || theme.colors?.primary || '#007AFF',
    },
    mapButtonText: {
      color: theme.colors?.onPrimary || '#fff',
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 4,
      letterSpacing: 0.5,
    },
    infoContainer: {
      backgroundColor: theme.colors?.surfaceVariant || '#f5f5f5',
      padding: theme.spacing?.s || 8,
      borderRadius: theme.spacing?.s || 8,
      marginBottom: theme.spacing?.s || 8,
    },
    coordsText: {
      fontSize: 12,
      color: theme.colors?.onSurfaceVariant || '#666',
      textAlign: 'center',
      lineHeight: 16,
    },
    errorText: {
      color: theme.colors?.error || '#ff3b30',
      fontSize: 12,
      marginTop: theme.spacing?.xs || 4,
      textAlign: 'center',
    },
  });
