import React, { useEffect } from 'react';
import { Animated, Pressable, Text } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './Snackbar.styles';

export interface SnackbarProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  duration?: number;
  type?: 'success' | 'error' | 'info';
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function Snackbar({
  visible,
  onDismiss,
  children,
  duration = 3000,
  type = 'info',
  action,
}: SnackbarProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, duration, onDismiss, opacity]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        styles[type],
        {
          opacity,
          transform: [
            {
              translateY: opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.message}>{children}</Text>
      {action ? (
        <Pressable onPress={action.onPress}>
          <Text style={styles.action}>{action.label}</Text>
        </Pressable>
      ) : (
        <Pressable onPress={onDismiss}>
          <Text style={styles.action}>OK</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}
