import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Path, Circle, Text } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface LocationPinProps {
  size?: number;
  animated?: boolean;
}

const LocationPin: React.FC<LocationPinProps> = ({ size = 80, animated = true }) => {
  // Animaciones
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    // Animación de rebote del pin
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    bounceAnimation.start();

    return () => {
      bounceAnimation.stop();
    };
  }, [animated, bounceAnim]);

  // Interpolaciones para animaciones
  const translateY = bounceAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -4, 0],
  });

  // Calcular tamaños proporcionales
  const pinSize = size * 0.625; // 50px cuando size=80
  const centerSize = pinSize * 0.64; // 32px cuando pinSize=50
  const fontSize = centerSize * 0.56; // 18px cuando centerSize=32

  // Crear el path del pin (forma de gota)
  const pinPath = `M ${size / 2} ${size * 0.875} 
                   C ${size / 2 - pinSize / 2} ${size * 0.875} ${size / 2 - pinSize / 2} ${size / 2 - pinSize / 4} ${size / 2} ${size / 2 - pinSize / 4}
                   C ${size / 2 + pinSize / 2} ${size / 2 - pinSize / 4} ${size / 2 + pinSize / 2} ${size * 0.875} ${size / 2} ${size * 0.875} Z`;

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        width: size,
        height: size,
      }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Pin base con gradiente simulado */}
        <AnimatedPath
          d={pinPath}
          fill="#667eea"
          transform={`rotate(-45 ${size / 2} ${size / 2 + pinSize / 4})`}
        />

        {/* Overlay para simular gradiente */}
        <Path
          d={pinPath}
          fill="#764ba2"
          opacity="0.6"
          transform={`rotate(-45 ${size / 2} ${size / 2 + pinSize / 4})`}
        />

        {/* Centro blanco del pin */}
        <Circle
          cx={size / 2}
          cy={size / 2 + pinSize / 8}
          r={centerSize / 2}
          fill="#ffffff"
          transform={`rotate(-45 ${size / 2} ${size / 2 + pinSize / 4})`}
        />

        {/* Letra N en el centro */}
        <Text
          x={size / 2}
          y={size / 2 + pinSize / 8 + fontSize * 0.35}
          fontSize={fontSize}
          fontWeight="bold"
          fill="#667eea"
          textAnchor="middle"
          fontFamily="Arial Black, sans-serif"
          transform={`rotate(-45 ${size / 2} ${size / 2 + pinSize / 4})`}
        >
          N
        </Text>
      </Svg>
    </Animated.View>
  );
};

export default LocationPin;
