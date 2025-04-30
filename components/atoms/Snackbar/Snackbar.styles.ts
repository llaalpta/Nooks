import { StyleSheet } from 'react-native';

import { AppColors } from '@/types/colors';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.primary,
      marginBottom: 16,
      borderRadius: 8,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 16,
      width: '90%',
      alignSelf: 'center',
      position: 'absolute',
      bottom: 0,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
    },
    success: {
      backgroundColor: colors.success,
    },
    error: {
      backgroundColor: colors.error,
    },
    info: {
      backgroundColor: colors.info,
    },
    message: {
      color: '#FFFFFF',
      flex: 1,
      marginRight: 8,
    },
    action: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
  });
