import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { View, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
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
import { AppTheme } from '@/types';
import { Tables } from '@/types/supabase';
import { calculateDistance } from '@/utils/locationUtils';

type Realm = Tables<'locations'>;

interface BottomRealmsListProps {
  realms: Realm[];
  userLocation: { latitude: number; longitude: number } | null;
  onRealmSelect: (realm: Realm) => void;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const INITIAL_HEIGHT = SCREEN_HEIGHT * 0.4; // 40% de la pantalla
const MAX_HEIGHT = SCREEN_HEIGHT * 0.8; // 80% de la pantalla
const MIN_HEIGHT = SCREEN_HEIGHT * 0.2; // 20% de la pantalla
const CLOSE_THRESHOLD = 150;

const BottomRealmsList: React.FC<BottomRealmsListProps> = ({
  realms,
  userLocation,
  onRealmSelect,
  onClose,
}) => {
  const theme = useAppTheme();
  const router = useRouter();
  const styles = createStyles(theme);

  // Animated values para el arrastre y altura
  const translateY = useSharedValue(0);
  const height = useSharedValue(INITIAL_HEIGHT);

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

  // Gesto de arrastre mejorado
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startHeight = height.value;
      context.startTranslateY = translateY.value;
    },
    onActive: (event, context: any) => {
      // Calcular nueva altura basada en el arrastre
      const newHeight = context.startHeight - event.translationY;

      // Limitar la altura entre MIN_HEIGHT y MAX_HEIGHT
      height.value = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight));

      // Si se arrastra hacia abajo más allá del mínimo, preparar para cerrar
      if (event.translationY > CLOSE_THRESHOLD) {
        translateY.value = event.translationY - CLOSE_THRESHOLD;
      } else {
        translateY.value = 0;
      }
    },
    onEnd: (event) => {
      // Si se arrastra mucho hacia abajo, cerrar
      if (event.translationY > CLOSE_THRESHOLD) {
        translateY.value = withSpring(SCREEN_HEIGHT, {}, () => {
          runOnJS(onClose)();
        });
        return;
      }

      // Snap a posiciones predefinidas
      const currentHeight = height.value;
      let targetHeight: number;

      if (currentHeight < MIN_HEIGHT + 50) {
        // Cerrar si está muy abajo
        translateY.value = withSpring(SCREEN_HEIGHT, {}, () => {
          runOnJS(onClose)();
        });
        return;
      } else if (currentHeight < INITIAL_HEIGHT - 50) {
        targetHeight = MIN_HEIGHT;
      } else if (currentHeight > MAX_HEIGHT - 50) {
        targetHeight = MAX_HEIGHT;
      } else {
        targetHeight = INITIAL_HEIGHT;
      }

      // Animar a la altura objetivo
      height.value = withSpring(targetHeight, {
        damping: 20,
        stiffness: 300,
      });
      translateY.value = withSpring(0);
    },
  });

  // Estilo animado para el contenedor
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, CLOSE_THRESHOLD],
      [1, 0.7],
      Extrapolate.CLAMP
    );

    return {
      height: height.value,
      transform: [{ translateY: translateY.value }],
      opacity,
    };
  });

  // Estilo animado para la barra de arrastre
  const handleStyle = useAnimatedStyle(() => {
    const progress = interpolate(height.value, [MIN_HEIGHT, MAX_HEIGHT], [0, 1], Extrapolate.CLAMP);

    const backgroundColor = interpolate(
      progress,
      [0, 1],
      [0.3, 0.6] // De 30% a 60% de opacidad
    );

    return {
      opacity: backgroundColor,
    };
  });

  // Ordenar realms por distancia cuando hay ubicación de usuario
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
    <GestureHandlerRootView style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={styles.handle}>
            <Animated.View style={[styles.handleBar, handleStyle]} />
          </Animated.View>
        </PanGestureHandler>

        <View style={styles.header}>
          <Text style={styles.title}>Realms cercanos</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={sortedRealms}
          keyExtractor={(item) => item.id || 'unknown'}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.realmItem} onPress={() => handleRealmPress(item)}>
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
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </GestureHandlerRootView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.l,
      borderTopRightRadius: theme.borderRadius.l,
      ...theme.elevation.level3,
    },
    handle: {
      alignItems: 'center',
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
    },
    handleBar: {
      width: 60,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.outlineVariant,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outlineVariant,
    },
    title: {
      fontSize: 18,
      fontWeight: '500',
      color: theme.colors.onSurface,
    },
    closeButton: {
      padding: theme.spacing.xs,
    },
    listContent: {
      paddingBottom: theme.spacing.l,
    },
    realmItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.surfaceVariant,
    },
    realmIconContainer: {
      marginRight: theme.spacing.m,
    },
    realmIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    realmInfo: {
      flex: 1,
    },
    realmName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.onSurface,
      marginBottom: 4,
    },
    realmAddress: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
    },
    realmActions: {
      alignItems: 'flex-end',
    },
    realmDistance: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    detailsButton: {
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    detailsButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.primary,
    },
  });

export default BottomRealmsList;
