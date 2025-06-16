import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { View, TouchableOpacity, FlatList, Dimensions, Image } from 'react-native';
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
  showAllRealms?: boolean; // Si es true, muestra todos los realms, si es false o undefined, solo los cercanos
  currentTab?: string; // Parámetro para indicar la tab actual (para navegación de retorno)
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SNAP_POINTS = {
  COLLAPSED: SCREEN_HEIGHT * 0.25,
  HALF: SCREEN_HEIGHT * 0.5,
  EXPANDED: SCREEN_HEIGHT * 0.85,
};

const CLOSE_THRESHOLD = 100;

const BottomRealmsList: React.FC<BottomRealmsListProps> = ({
  realms,
  userLocation,
  onRealmSelect,
  onClose,
  showAllRealms = false,
  currentTab = 'map',
}) => {
  const theme = useAppTheme();
  const router = useRouter();
  const styles = createStyles(theme);

  const translateY = useSharedValue(SCREEN_HEIGHT);

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

      const minY = SCREEN_HEIGHT - SNAP_POINTS.EXPANDED;
      const maxY = SCREEN_HEIGHT;

      translateY.value = Math.max(minY, Math.min(maxY, newY));
    },
    onEnd: (event) => {
      'worklet';
      const currentY = translateY.value;
      const velocityY = event.velocityY;

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

      const snapPointsY = [
        SCREEN_HEIGHT - SNAP_POINTS.EXPANDED,
        SCREEN_HEIGHT - SNAP_POINTS.HALF,
        SCREEN_HEIGHT - SNAP_POINTS.COLLAPSED,
      ];

      let targetY = snapPointsY[0];
      let minDistance = Math.abs(snapPointsY[0] - currentY);

      for (let i = 1; i < snapPointsY.length; i++) {
        const distance = Math.abs(snapPointsY[i] - currentY);
        if (distance < minDistance) {
          minDistance = distance;
          targetY = snapPointsY[i];
        }
      }

      if (Math.abs(velocityY) > 500) {
        if (velocityY > 0) {
          const currentIndex = snapPointsY.findIndex((point) => point >= currentY);
          if (currentIndex >= 0 && currentIndex < snapPointsY.length - 1) {
            targetY = snapPointsY[currentIndex + 1];
          }
        } else {
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

  const sortedRealms = [...realms].sort((a, b) => {
    if (showAllRealms) {
      // Si se muestran todos los realms, ordenar alfabéticamente por defecto
      // pero si hay ubicación del usuario, priorizar los más cercanos primero
      if (userLocation) {
        const distanceA = getDistance(a) || Infinity;
        const distanceB = getDistance(b) || Infinity;

        // Si ambos tienen distancia válida, ordenar por distancia
        if (distanceA !== Infinity && distanceB !== Infinity) {
          return distanceA - distanceB;
        }
        // Si solo uno tiene distancia válida, priorizarlo
        if (distanceA !== Infinity) return -1;
        if (distanceB !== Infinity) return 1;
      }
      // Fallback: ordenar alfabéticamente
      return (a.name || '').localeCompare(b.name || '');
    } else {
      // Comportamiento original: ordenar por distancia
      const distanceA = getDistance(a) || Infinity;
      const distanceB = getDistance(b) || Infinity;
      return distanceA - distanceB;
    }
  });
  const formatDistance = (distance: number | null) => {
    if (showAllRealms && !userLocation) {
      return ''; // No mostrar distancia si no hay ubicación y se muestran todos los realms
    }
    if (distance === null) return '—';
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  const handleRealmPress = (realm: Realm) => {
    onRealmSelect(realm);
  };  const handleRealmDetails = (realm: Realm) => {
    router.push({
      pathname: `/realms/${realm.id}` as any,
      params: { returnTo: currentTab }
    });
  };

  return (
    <GestureHandlerRootView style={styles.overlay}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={styles.draggableHeader}>
            <View style={styles.handle}>
              <Animated.View style={[styles.handleBar, handleBarStyle]} />
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>
                {showAllRealms ? 'Selecciona un realm' : 'Realms cercanos'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </PanGestureHandler>

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
                      <Image
                        source={require('@/assets/images/realm-marker.png')}
                        style={styles.realmIcon}
                        resizeMode="contain"
                      />
                    </View>

                    <View style={styles.realmInfo}>
                      <Text style={styles.realmName}>{item.name}</Text>
                      <Text style={styles.realmAddress} numberOfLines={1}>
                        {item.description || 'Sin descripción'}
                      </Text>
                    </View>

                    <View style={styles.realmActions}>
                      {(!showAllRealms || userLocation) && (
                        <Text style={styles.realmDistance}>
                          {formatDistance(getDistance(item))}
                        </Text>
                      )}
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
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
            bounces={true}
            alwaysBounceVertical={true}
            contentInsetAdjustmentBehavior="never"
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={false}
            ListFooterComponent={<View style={styles.forcedScrollSpace} />}
          />
        </View>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

export default BottomRealmsList;
