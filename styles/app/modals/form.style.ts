// === BOTONES FLOTANTES ===

// styles/app/shared/form.style.ts
// Estilos compartidos y unificados para realm-form y nook-form

import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createUnifiedFormStyles = (theme: AppTheme) =>
  StyleSheet.create({
    // === CONTENEDORES PRINCIPALES ===
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    formContainer: {
      padding: theme.spacing.m,
      paddingBottom: theme.spacing.xl,
    },

    // === HEADER UNIFICADO ===
    header: {
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.m,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outlineVariant,
      ...theme.elevation.level1,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: '600',
      lineHeight: 28,
      color: theme.colors.onSurface,
      textAlign: 'center',
    },
    floatingActionContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.background,
      paddingBottom: theme.spacing.s, // Espacio para SafeArea
      paddingTop: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
      zIndex: 100,
    },
    floatingActionInner: {
      flexDirection: 'column',
      gap: theme.spacing.m,
    },

    // === SECCIONES DEL FORMULARIO ===
    formSection: {
      marginBottom: theme.spacing.m, // Menos separación entre secciones
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
    sectionContent: {
      // Sin padding adicional - controlado por cada input
    },

    // === INPUTS Y CONTROLES ===
    inputSpacing: {
      marginBottom: theme.spacing.m,
    },
    inputSpacingLast: {
      marginBottom: 0,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.s,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      lineHeight: 16,
      marginTop: theme.spacing.xs,
    },

    // === BOTONES DE ACCIÓN ===
    actionContainer: {
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.l,
      gap: theme.spacing.m,
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

    // === ESTADOS ESPECIALES ===
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
    loadingState: {
      opacity: 0.7,
    },

    // === INFORMACIÓN Y COORDENADAS ===
    coordsContainer: {
      backgroundColor: theme.colors.surfaceVariant,
      padding: theme.spacing.s,
      borderRadius: theme.spacing.s,
      marginBottom: theme.spacing.s,
    },
    coordsText: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 16,
    },

    // === BOTONES ESPECÍFICOS (para nook-form) ===
    realmButton: {
      marginVertical: theme.spacing.s,
      borderRadius: theme.spacing.s,
    },
    changeRealmButton: {
      marginTop: theme.spacing.m,
    },

    // === CONTENEDORES FLEXIBLES ===
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.l,
      gap: theme.spacing.m,
    },
    buttonFlex: {
      flex: 1,
    },

    // === ESTADOS DE DISABLED ===
    disabledContainer: {
      opacity: 0.6,
    },
    disabledText: {
      color: theme.colors.onSurfaceVariant,
    },

    // === ESPACIADO ESPECÍFICO ===
    marginBottomNone: {
      marginBottom: 0,
    },
    marginBottomSmall: {
      marginBottom: theme.spacing.s,
    },
    marginBottomMedium: {
      marginBottom: theme.spacing.m,
    },
    marginBottomLarge: {
      marginBottom: theme.spacing.l,
    },
    marginBottomXLarge: {
      marginBottom: theme.spacing.xl,
    },

    // === PADDING ESPECÍFICO ===
    paddingNone: {
      padding: 0,
    },
    paddingSmall: {
      padding: theme.spacing.s,
    },
    paddingMedium: {
      padding: theme.spacing.m,
    },
    paddingLarge: {
      padding: theme.spacing.l,
    },
  });

// Función helper para crear estilos específicos de cada formulario
export const createRealmFormStyles = (theme: AppTheme) => ({
  ...createUnifiedFormStyles(theme),
  // Estilos específicos adicionales para realm-form si los necesitas
});

export const createNookFormStyles = (theme: AppTheme) => ({
  ...createUnifiedFormStyles(theme),
  // Estilos específicos adicionales para nook-form si los necesitas
});
