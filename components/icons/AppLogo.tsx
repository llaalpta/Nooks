import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Rect, Circle, Text } from 'react-native-svg';

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface AppLogoProps {
  size?: number;
  animated?: boolean;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 100, animated = true }) => {
  // Animaciones
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    // Animación de pulso del logo
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    // Animación de brillo
    const shineAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    pulseAnimation.start();
    shineAnimation.start();

    return () => {
      pulseAnimation.stop();
      shineAnimation.stop();
    };
  }, [animated, pulseAnim, shineAnim]);

  // Interpolaciones para animaciones
  const scaleTransform = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  const shineOpacity = shineAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.8, 0.3],
  });

  const shineScale = shineAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.3, 1],
  });

  // Calcular tamaños proporcionales
  const borderRadius = size * 0.25;
  const fontSize = size * 0.5;
  const shineSize = size * 0.3;

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleTransform }],
        width: size,
        height: size,
      }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Fondo del logo con gradiente simulado */}
        <AnimatedRect
          x="0"
          y="0"
          width={size}
          height={size}
          rx={borderRadius}
          ry={borderRadius}
          fill="#667eea"
        />

        {/* Overlay para simular gradiente */}
        <Rect
          x="0"
          y="0"
          width={size}
          height={size * 0.6}
          rx={borderRadius}
          ry={borderRadius}
          fill="#764ba2"
          opacity="0.7"
        />

        {/* Letra N */}
        <Text
          x={size / 2}
          y={size / 2 + fontSize * 0.35}
          fontSize={fontSize}
          fontWeight="bold"
          fill="#ffffff"
          textAnchor="middle"
          fontFamily="Arial Black, sans-serif"
        >
          N
        </Text>

        {/* Efecto de brillo animado */}
        {animated ? (
          <AnimatedCircle
            cx={size * 0.25}
            cy={size * 0.25}
            r={shineSize / 2}
            fill="#ffffff"
            opacity={shineOpacity}
            transform={[{ scale: shineScale }]}
          />
        ) : (
          <Circle
            cx={size * 0.25}
            cy={size * 0.25}
            r={shineSize / 2}
            fill="#ffffff"
            opacity="0.4"
          />
        )}
      </Svg>
    </Animated.View>
  );
};

export default AppLogo;
