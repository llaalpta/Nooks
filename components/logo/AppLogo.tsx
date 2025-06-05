import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, Text, G, Path } from 'react-native-svg';

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
  const shineSize = size * 0.3;

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleTransform }],
        width: size,
        height: size,
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 300 100">
        <Text
          x={20}
          y={70}
          fontFamily="Arial, sans-serif"
          fontSize={60}
          fontWeight="bold"
          fill="#374151"
        >
          {'n'}
        </Text>
        <G transform="matrix(.4 0 0 .4 68 55)">
          <Path d="M0 40Q-35 5-35-25q0-35 35-35t35 35Q35 5 0 40" fill="#6366f1" />
          <Circle cy={-25} r={25} fill="#fff" />
          <Text
            y={-20}
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize={16}
            fontWeight="bold"
            fill="#6366f1"
          >
            {'nook'}
          </Text>
        </G>
        <Text
          x={85}
          y={70}
          fontFamily="Arial, sans-serif"
          fontSize={60}
          fontWeight="bold"
          fill="#374151"
        >
          {'oks'}
        </Text>

        {/* Efecto de brillo animado opcional */}
        {animated && (
          <AnimatedCircle
            cx={150}
            cy={50}
            r={shineSize / 2}
            fill="#ffffff"
            opacity={shineOpacity}
            transform={[{ scale: shineScale }]}
          />
        )}
      </Svg>
    </Animated.View>
  );
};

export default AppLogo;
