import { StyleSheet } from 'react-native';

// No necesitamos importar AppColors ya que no estamos usando el parámetro colors
export const createStyles = () =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
