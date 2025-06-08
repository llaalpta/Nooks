import { router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface FeatureCardProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  imagePath: any;
}

const features: FeatureCardProps[] = [
  {
    id: 'realms',
    title: 'Realms',
    subtitle: 'Ubicaciones generales',
    description: 'Casa, oficina, almacén... organiza tus espacios principales',
    icon: '🏠',
    color: '#6366f1',
    route: '/(tabs)/realms',
    imagePath: require('@/assets/images/realm-marker.png'),
  },
  {
    id: 'nooks',
    title: 'Nooks',
    subtitle: 'Puntos dentro de un Realm',
    description: 'Cajones, estantes, armarios... localiza tus espacios concretos',
    icon: '📦',
    color: '#06b6d4',
    route: '/(tabs)/realms', // O ruta específica si existe
    imagePath: require('@/assets/images/nook-marker.png'),
  },
  {
    id: 'treasures',
    title: 'Treasures',
    subtitle: 'Tus objetos guardados',
    description: 'Cataloga todos tus objetos con fotos y detalles',
    icon: '💎',
    color: '#f59e0b',
    route: '/(tabs)/treasures',
    imagePath: require('@/assets/images/treasure.png'),
  },
  {
    id: 'map',
    title: 'Mapa',
    subtitle: 'Geolocalización',
    description: 'Encuentra tus Realms en un mapa interactivo',
    icon: '🗺️',
    color: '#10b981',
    route: '/(tabs)/map',
    imagePath: require('@/assets/images/map.png'),
  },
  {
    id: 'tags',
    title: 'Tags',
    subtitle: 'Organización inteligente',
    description: 'Etiquetas personalizables para filtrar y categorizar',
    icon: '🏷️',
    color: '#8b5cf6',
    route: '/(tabs)/tags',
    imagePath: require('@/assets/images/tags.png'),
  },
];

const HierarchyVisualization = () => {
  const theme = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.l,
        marginVertical: theme.spacing.l,
        borderWidth: 2,
        borderColor: theme.colors.outline,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          color: theme.colors.onSurface,
          marginBottom: theme.spacing.m,
          textAlign: 'center',
        }}
      >
        ¿Cómo funciona Nooks?
      </Text>

      <View style={{ alignItems: 'center' }}>
        {/* Realm */}
        <View
          style={{
            backgroundColor: theme.colors.primary,
            paddingHorizontal: theme.spacing.l,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.borderRadius.m,
            marginBottom: theme.spacing.sm,
          }}
        >
          <Text
            style={{
              color: theme.colors.onPrimary,
              fontWeight: '600',
              fontSize: 16,
            }}
          >
            🏠 Realm: Casa
          </Text>
        </View>

        {/* Arrow */}
        <Text
          style={{
            fontSize: 20,
            color: theme.colors.onSurfaceVariant,
            marginBottom: theme.spacing.s,
          }}
        >
          ↓
        </Text>

        {/* Nooks */}
        <View
          style={{
            flexDirection: 'row',
            gap: theme.spacing.s,
            marginBottom: theme.spacing.sm,
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.secondary,
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: theme.spacing.s,
              borderRadius: theme.borderRadius.s,
            }}
          >
            <Text
              style={{
                color: theme.colors.onSecondary,
                fontWeight: '500',
                fontSize: 12,
              }}
            >
              📦 Nook: Cajón
            </Text>
          </View>
          <View
            style={{
              backgroundColor: theme.colors.secondary,
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: theme.spacing.s,
              borderRadius: theme.borderRadius.s,
            }}
          >
            <Text
              style={{
                color: theme.colors.onSecondary,
                fontWeight: '500',
                fontSize: 12,
              }}
            >
              📚 Nook: Estante
            </Text>
          </View>
        </View>

        {/* Arrow */}
        <Text
          style={{
            fontSize: 20,
            color: theme.colors.onSurfaceVariant,
            marginBottom: theme.spacing.s,
          }}
        >
          ↓
        </Text>

        {/* Treasures */}
        <View
          style={{
            flexDirection: 'row',
            gap: 6,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {['💍 Anillo', '📱 Cargador', '📖 Libro', '🔑 Llaves'].map((treasure, index) => (
            <View
              key={index}
              style={{
                backgroundColor: theme.colors.tertiary,
                paddingHorizontal: theme.spacing.s,
                paddingVertical: theme.spacing.xs,
                borderRadius: theme.borderRadius.xs,
                marginBottom: theme.spacing.xs,
              }}
            >
              <Text
                style={{
                  color: theme.colors.onTertiary,
                  fontWeight: '400',
                  fontSize: 10,
                }}
              >
                {treasure}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const FeatureCard = ({
  feature,
  isSelected,
  onPress,
}: {
  feature: FeatureCardProps;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      style={{
        width: (width - theme.spacing.l * 3) / 2,
        backgroundColor: isSelected ? feature.color : theme.colors.surface,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.l,
        borderWidth: 2,
        borderColor: feature.color,
        ...theme.elevation.level2,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Usar imagen PNG personalizada */}
      <View style={{ alignItems: 'center', marginBottom: theme.spacing.sm }}>
        <Image
          source={feature.imagePath}
          style={{
            width: 32,
            height: 32,
            tintColor: isSelected ? '#ffffff' : feature.color,
          }}
          resizeMode="contain"
        />
      </View>

      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          color: isSelected ? '#ffffff' : feature.color,
          marginBottom: 4,
          textAlign: 'center',
        }}
      >
        {feature.title}
      </Text>

      <Text
        style={{
          fontSize: 12,
          fontWeight: '500',
          color: isSelected ? '#ffffff' : theme.colors.onSurfaceVariant,
          marginBottom: theme.spacing.s,
          textAlign: 'center',
        }}
      >
        {feature.subtitle}
      </Text>

      <Text
        style={{
          fontSize: 11,
          color: isSelected ? '#ffffff' : theme.colors.onSurfaceVariant,
          textAlign: 'center',
          lineHeight: 16,
        }}
      >
        {feature.description}
      </Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const theme = useAppTheme();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const handleFeaturePress = (feature: FeatureCardProps) => {
    setSelectedCard(feature.id);
    setTimeout(() => {
      setSelectedCard(null);
      handleNavigation(feature.route);
    }, 150);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: theme.spacing.l,
            paddingTop: theme.spacing.l,
            paddingBottom: theme.spacing.m,
          }}
        >
          <Animated.View
            style={{
              transform: [{ scale: pulseScale }],
              alignItems: 'center',
            }}
          >
            {/* Logo o icono principal */}

            <Text
              style={{
                fontSize: 28,
                fontWeight: '900',
                color: theme.colors.primary,
                textAlign: 'center',
                marginBottom: theme.spacing.l,
                letterSpacing: 1,
              }}
            >
              ¡Organiza tus tesoros y nunca pierdas nada!
            </Text>
          </Animated.View>

          <Text
            style={{
              fontSize: 16,
              color: theme.colors.onSurfaceVariant,
              textAlign: 'center',
              lineHeight: 24,
              marginBottom: theme.spacing.l,
            }}
          >
            Catáloga tus espacios, localiza tus objetos y conviértete en el explorador de tu propio
            hogar.
          </Text>
        </View>

        {/* Quick Stats */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: theme.spacing.l,
            paddingVertical: theme.spacing.m,
            gap: theme.spacing.sm,
          }}
        >
          {/* Quick Stats con iconos grandes y colores temáticos */}
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.primaryContainer,
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.m,
              alignItems: 'center',
            }}
          >
            <Image
              source={require('@/assets/images/realm-marker.png')}
              style={{ width: 36, height: 36, marginBottom: 2 }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: theme.colors.primary,
                marginBottom: 2,
              }}
            >
              Realms
            </Text>
            <Text
              style={{ fontSize: 12, color: theme.colors.onPrimaryContainer, textAlign: 'center' }}
            >
              Tus espacios
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.secondaryContainer,
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.m,
              alignItems: 'center',
            }}
          >
            <Image
              source={require('@/assets/images/nook-marker.png')}
              style={{ width: 36, height: 36, marginBottom: 2 }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: theme.colors.secondary,
                marginBottom: 2,
              }}
            >
              Nooks
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: theme.colors.onSecondaryContainer,
                textAlign: 'center',
              }}
            >
              Tus rincones
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.tertiaryContainer,
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.m,
              alignItems: 'center',
            }}
          >
            <Image
              source={require('@/assets/images/treasure.png')}
              style={{ width: 36, height: 36, marginBottom: 2 }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: theme.colors.tertiary,
                marginBottom: 2,
              }}
            >
              Treasures
            </Text>
            <Text
              style={{ fontSize: 12, color: theme.colors.onTertiaryContainer, textAlign: 'center' }}
            >
              Tus objetos
            </Text>
          </View>
        </View>

        {/* Hierarchy Visualization */}
        <View style={{ paddingHorizontal: theme.spacing.l }}>
          <HierarchyVisualization />
        </View>

        {/* Features Grid */}
        <View style={{ paddingHorizontal: theme.spacing.l }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: theme.colors.onSurface,
              marginBottom: theme.spacing.m,
              textAlign: 'center',
            }}
          >
            🚀 Explora las funciones
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: theme.spacing.sm,
              justifyContent: 'space-between',
            }}
          >
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                isSelected={selectedCard === feature.id}
                onPress={() => handleFeaturePress(feature)}
              />
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View
          style={{
            marginHorizontal: theme.spacing.l,
            marginTop: theme.spacing.xl,
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.l,
            alignItems: 'center',
          }}
        >
          <Image
            source={require('@/assets/images/treasure.png')}
            style={{ width: 48, height: 48, marginBottom: theme.spacing.s }}
            resizeMode="contain"
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: theme.colors.onPrimaryContainer,
              marginBottom: theme.spacing.s,
              textAlign: 'center',
            }}
          >
            ¡Empieza tu aventura organizando!
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.onPrimaryContainer,
              textAlign: 'center',
              marginBottom: theme.spacing.l,
              lineHeight: 20,
              opacity: 0.8,
            }}
          >
            Crea tu primer Realm y comienza a catalogar tus objetos como un auténtico explorador de
            tesoros.
          </Text>

          <TouchableOpacity
            onPress={() => handleNavigation('/(tabs)/realms')}
            style={{
              backgroundColor: theme.colors.primary,
              paddingHorizontal: theme.spacing.xl,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.borderRadius.round,
              ...theme.elevation.level3,
            }}
          >
            <Text
              style={{
                color: theme.colors.onPrimary,
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              ¡Crear mi primer Realm!
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
