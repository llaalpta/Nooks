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
  const styles = createStyles(theme);

  // create an animated value that will be used to animate the thumb position
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  // to calculate the thumb position based on the animated value
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

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
