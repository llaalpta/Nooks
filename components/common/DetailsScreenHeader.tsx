import { Ionicons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/DetailsScreenHeader.styles';

interface DetailsScreenHeaderProps {
  title: string;
  onBack?: () => void;
  backRoute?: Href;
  showOptionsMenu?: boolean;
  onToggleOptionsMenu?: () => void;
  optionsMenuItems?: {
    icon: string;
    label: string;
    onPress: () => void;
    color?: string;
  }[];
}

export const DetailsScreenHeader: React.FC<DetailsScreenHeaderProps> = ({
  title,
  onBack,
  backRoute,
  showOptionsMenu = false,
  onToggleOptionsMenu,
  optionsMenuItems = [],
}) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backRoute) {
      router.push(backRoute);
    } else {
      router.back();
    }
  };

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            accessibilityLabel="Volver"
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
          </TouchableOpacity>

          {/* Título centrado */}
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>

          {optionsMenuItems.length > 0 ? (
            <TouchableOpacity
              style={styles.optionsButton}
              onPress={() => {
                onToggleOptionsMenu?.();
              }}
            >
              <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      </View>

      {/* Menú de opciones */}
      {showOptionsMenu && optionsMenuItems.length > 0 && (
        <View style={styles.optionsMenu}>
          {optionsMenuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.optionItem} onPress={item.onPress}>
              <Ionicons
                name={item.icon as any}
                size={18}
                color={item.color || theme.colors.primary}
              />
              <Text style={[styles.optionText, item.color ? { color: item.color } : null]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
};
