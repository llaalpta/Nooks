import { StyleSheet } from 'react-native';

import { AppColors } from '@/types/colors';

// Ahora recibimos directamente el objeto colors del tema tipado
export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    button: {
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    contained: {
      backgroundColor: colors.primary,
    },
    outlined: {
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: 'transparent',
    },
    text: {
      backgroundColor: 'transparent',
    },
    disabled: {
      opacity: 0.6,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
    },
    labelContained: {
      color: colors.onPrimary,
    },
    labelOutlined: {
      color: colors.primary,
    },
    labelText: {
      color: colors.primary,
    },
    labelDisabled: {
      color: colors.onSurfaceVariant,
    },
    icon: {
      marginRight: 8,
    },
    loading: {
      marginRight: 8,
    },
  });
