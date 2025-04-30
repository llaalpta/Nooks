import React from 'react';
import { Animated, TouchableOpacity, View, ViewStyle, Easing } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './Switch.styles';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  color?: string;
  style?: ViewStyle;
}

export function Switch({ value, onValueChange, disabled, color, style }: SwitchProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);

  // Creamos una animación para el movimiento del thumb
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  // Calculamos la posición del thumb basado en el valor de la animación
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // Calculamos la posición final basada en el ancho del track menos el ancho del thumb
  });

  // Usamos el color personalizado si se proporciona, de lo contrario usamos el color primario del tema
  const trackColor = color || theme.colors.primary;

  const handleToggle = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleToggle}
        disabled={disabled}
        style={{ opacity: disabled ? 0.5 : 1 }}
      >
        <View
          style={[
            styles.track,
            value && styles.trackActive,
            value && color ? { backgroundColor: trackColor } : null,
          ]}
        >
          <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
        </View>
      </TouchableOpacity>
    </View>
  );
}
