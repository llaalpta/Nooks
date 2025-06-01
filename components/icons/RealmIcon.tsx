import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Ellipse, Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface RealmIconProps {
  size?: number;
  animated?: boolean;
}

const RealmIcon: React.FC<RealmIconProps> = ({ size = 80, animated = true }) => {
  // Animaciones
  const floatAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim1 = useRef(new Animated.Value(0)).current;
  const sparkleAnim2 = useRef(new Animated.Value(0)).current;
  const sparkleAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    // Animación de flotación
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );

    // Animaciones de destellos
    const sparkle1Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim1, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(sparkleAnim1, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    const sparkle2Animation = Animated.loop(
      Animated.sequence([
        Animated.delay(700),
        Animated.timing(sparkleAnim2, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(sparkleAnim2, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    const sparkle3Animation = Animated.loop(
      Animated.sequence([
        Animated.delay(1400),
        Animated.timing(sparkleAnim3, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(sparkleAnim3, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    floatAnimation.start();
    sparkle1Animation.start();
    sparkle2Animation.start();
    sparkle3Animation.start();

    return () => {
      floatAnimation.stop();
      sparkle1Animation.stop();
      sparkle2Animation.stop();
      sparkle3Animation.stop();
    };
  }, [animated, floatAnim, sparkleAnim1, sparkleAnim2, sparkleAnim3]);

  // Interpolaciones para animaciones
  const sparkle1Opacity = sparkleAnim1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  const sparkle2Opacity = sparkleAnim2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  const sparkle3Opacity = sparkleAnim3.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  const floatTransform = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  return (
    <Animated.View
      style={{
        transform: [{ translateY: floatTransform }],
        width: size,
        height: size,
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 80 80">
        {/* Sombra sutil */}
        <Ellipse cx="40" cy="70" rx="30" ry="6" fill="#87ceeb" opacity="0.15" />

        {/* Nube izquierda */}
        <Circle cx="20" cy="30" r="15" fill="#e1efff" />

        {/* Nube derecha */}
        <Circle cx="60" cy="27" r="17" fill="#eaf4ff" />

        {/* Nube base (centro) */}
        <Ellipse cx="40" cy="42" rx="27" ry="17" fill="#cce7ff" />

        {/* Nube superior */}
        <Circle cx="40" cy="20" r="12" fill="#eff7ff" />

        {/* Destellos con animación */}
        {animated ? (
          <>
            <AnimatedCircle cx="30" cy="15" r="3" fill="#ffffff" opacity={sparkle1Opacity} />
            <AnimatedCircle cx="55" cy="35" r="3" fill="#ffffff" opacity={sparkle2Opacity} />
            <AnimatedCircle cx="25" cy="55" r="3" fill="#ffffff" opacity={sparkle3Opacity} />
          </>
        ) : (
          <>
            <Circle cx="30" cy="15" r="2" fill="#ffffff" opacity="0.6" />
            <Circle cx="55" cy="35" r="2" fill="#ffffff" opacity="0.6" />
            <Circle cx="25" cy="55" r="2" fill="#ffffff" opacity="0.6" />
          </>
        )}
      </Svg>
    </Animated.View>
  );
};

export default RealmIcon;

// Ejemplo de uso:
/*
import RealmIcon from './components/icons/RealmIcon';

// En tu componente:
<View style={{ alignItems: 'center', justifyContent: 'center' }}>
  <RealmIcon size={80} animated={true} />
</View>

// En un botón
<TouchableOpacity onPress={() => console.log('Realm pressed')}>
  <RealmIcon size={60} />
</TouchableOpacity>
*/
