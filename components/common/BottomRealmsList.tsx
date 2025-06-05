import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { View, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Tables } from '@/types/supabase';
import { calculateDistance } from '@/utils/locationUtils';

import { createStyles } from '../forms/styles/BottomRealmsList.styles';

type Realm = Tables<'locations'>;

interface BottomRealmsListProps {
  realms: Realm[];
  userLocation: { latitude: number; longitude: number } | null;
  onRealmSelect: (realm: Realm) => void;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Snap points como porcentajes de la pantalla
const SNAP_POINTS = {
  COLLAPSED: SCREEN_HEIGHT * 0.25, // 25%
  HALF: SCREEN_HEIGHT * 0.5, // 50%
  EXPANDED: SCREEN_HEIGHT * 0.85, // 85%
};

const CLOSE_THRESHOLD = 100;

const BottomRealmsList: React.FC<BottomRealmsListProps> = ({
  realms,
  userLocation,
  onRealmSelect,
  onClose,
}) => {
  const theme = useAppTheme();
  const router = useRouter();
  const styles = createStyles(theme);

  const translateY = useSharedValue(SCREEN_HEIGHT);

  // Animación de entrada
  useEffect(() => {
    translateY.value = withSpring(SCREEN_HEIGHT - SNAP_POINTS.HALF, {
      damping: 50,
      stiffness: 300,
    });
  }, []);

  const getDistance = useCallback(
    (realm: Realm) => {
      if (!userLocation || !realm.latitude || !realm.longitude) {
        return null;
      }

      return calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        realm.latitude,
        realm.longitude
      );
    },
    [userLocation]
  );

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startY = translateY.value;
    },
    onActive: (event, context: any) => {
      const newY = context.startY + event.translationY;

      // Limitar el movimiento
      const minY = SCREEN_HEIGHT - SNAP_POINTS.EXPANDED;
      const maxY = SCREEN_HEIGHT;

      translateY.value = Math.max(minY, Math.min(maxY, newY));
    },
    onEnd: (event) => {
      'worklet';
      const currentY = translateY.value;
      const velocityY = event.velocityY;

      // Si se arrastra hacia abajo con velocidad alta o pasa el threshold, cerrar
      if (velocityY > 1000 || currentY > SCREEN_HEIGHT - CLOSE_THRESHOLD) {
        translateY.value = withSpring(
          SCREEN_HEIGHT,
          {
            damping: 50,
            stiffness: 300,
          },
          () => {
            runOnJS(onClose)();
          }
        );
        return;
      }

      // Definir snap points como worklet
      const snapPointsY = [
        SCREEN_HEIGHT - SNAP_POINTS.EXPANDED,
        SCREEN_HEIGHT - SNAP_POINTS.HALF,
        SCREEN_HEIGHT - SNAP_POINTS.COLLAPSED,
      ];

      // Encontrar el snap point más cercano
      let targetY = snapPointsY[0];
      let minDistance = Math.abs(snapPointsY[0] - currentY);

      for (let i = 1; i < snapPointsY.length; i++) {
        const distance = Math.abs(snapPointsY[i] - currentY);
        if (distance < minDistance) {
          minDistance = distance;
          targetY = snapPointsY[i];
        }
      }

      // Si hay velocidad considerable, ajustar el target
      if (Math.abs(velocityY) > 500) {
        if (velocityY > 0) {
          // Moviendo hacia abajo - ir al siguiente snap point inferior
          const currentIndex = snapPointsY.findIndex((point) => point >= currentY);
          if (currentIndex >= 0 && currentIndex < snapPointsY.length - 1) {
            targetY = snapPointsY[currentIndex + 1];
          }
        } else {
          // Moviendo hacia arriba - ir al siguiente snap point superior
          const reversedSnapPoints = [
            SCREEN_HEIGHT - SNAP_POINTS.COLLAPSED,
            SCREEN_HEIGHT - SNAP_POINTS.HALF,
            SCREEN_HEIGHT - SNAP_POINTS.EXPANDED,
          ];
          const currentIndex = reversedSnapPoints.findIndex((point) => point <= currentY);
          if (currentIndex >= 0 && currentIndex < reversedSnapPoints.length - 1) {
            targetY = reversedSnapPoints[currentIndex + 1];
          }
        }
      }

      translateY.value = withSpring(targetY, {
        damping: 50,
        stiffness: 300,
        velocity: velocityY,
      });
    },
  });

  // Estilo animado simplificado
  const animatedStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateY.value,
      [SCREEN_HEIGHT - SNAP_POINTS.EXPANDED, SCREEN_HEIGHT],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY: translateY.value }],
      opacity: interpolate(progress, [0, 0.5, 1], [0.5, 0.8, 1], Extrapolate.CLAMP),
    };
  });

  // Estilo para la barra indicadora
  const handleBarStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateY.value,
      [SCREEN_HEIGHT - SNAP_POINTS.EXPANDED, SCREEN_HEIGHT - SNAP_POINTS.COLLAPSED],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity: interpolate(progress, [0, 1], [0.3, 0.8], Extrapolate.CLAMP),
      backgroundColor: theme.colors.outlineVariant,
    };
  });

  // Ordenar realms por distancia
  const sortedRealms = [...realms].sort((a, b) => {
    const distanceA = getDistance(a) || Infinity;
    const distanceB = getDistance(b) || Infinity;
    return distanceA - distanceB;
  });

  const formatDistance = (distance: number | null) => {
    if (distance === null) return '—';
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  const handleRealmPress = (realm: Realm) => {
    onRealmSelect(realm);
  };

  const handleRealmDetails = (realm: Realm) => {
    router.push(`/realms/${realm.id}`);
  };

  return (
    <GestureHandlerRootView style={styles.overlay}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* Header arrastrable - SOLO esta parte maneja el gesto */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={styles.draggableHeader}>
            {/* Handle visual */}
            <View style={styles.handle}>
              <Animated.View style={[styles.handleBar, handleBarStyle]} />
            </View>

            {/* Header visual */}
            <View style={styles.header}>
              <Text style={styles.title}>Realms cercanos</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </PanGestureHandler>

        {/* Lista scrolleable - SIN PanGestureHandler */}
        <View style={styles.listContainer}>
          <FlatList
            data={sortedRealms}
            keyExtractor={(item) => item.id || 'unknown'}
            renderItem={({ item }) => (
              <View style={styles.realmItem}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  activeOpacity={0.7}
                  onPress={() => handleRealmPress(item)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.realmIconContainer}>
                      <View style={styles.realmIcon}>
                        <Ionicons name="map" size={22} color={theme.colors.onPrimary} />
                      </View>
                    </View>

                    <View style={styles.realmInfo}>
                      <Text style={styles.realmName}>{item.name}</Text>
                      <Text style={styles.realmAddress} numberOfLines={1}>
                        {item.description || 'Sin descripción'}
                      </Text>
                    </View>

                    <View style={styles.realmActions}>
                      <Text style={styles.realmDistance}>{formatDistance(getDistance(item))}</Text>
                      <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={() => handleRealmDetails(item)}
                      >
                        <Text style={styles.detailsButtonText}>DETALLES</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            // FORZAR que siempre sea scrolleable con bounce
            scrollEnabled={true}
            bounces={true}
            alwaysBounceVertical={true}
            // Esto es clave: fuerza un contentSize mínimo
            contentInsetAdjustmentBehavior="never"
            // Añade padding extra al final para forzar scroll
            ListFooterComponent={<View style={styles.forcedScrollSpace} />}
          />
        </View>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

export default BottomRealmsList;
