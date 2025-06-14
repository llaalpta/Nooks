import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import { useFormContext, Controller, Path } from 'react-hook-form';
import {
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import { CreateTagForm } from '@/app/tags/CreateTagForm';
import { Spinner } from '@/components/atoms/Spinner';
import { Text } from '@/components/atoms/Text';
import { TextInput } from '@/components/atoms/TextInput';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/TagSelector.styles';

import type { Tag } from '../../features/tags/hooks';

interface TagSelectorProps<T extends object> {
  name: Path<T>;
  label?: string;
  options: Tag[];
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onSearchFocus?: () => void;
}

export const TagSelector = <T extends object>({
  name,
  label,
  options,
  loading,
  disabled,
  style,
  onSearchFocus,
}: TagSelectorProps<T>) => {
  const { control } = useFormContext<T>();
  const [searchInput, setSearchInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const theme = useAppTheme();
  const styles = createStyles(theme);

  function normalize(str: string) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  const filteredOptions = useMemo(
    () => options.filter((tag) => normalize(tag.name).includes(normalize(searchInput))),
    [searchInput, options]
  );

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { value = [], onChange }, fieldState: { error } }) => {
          const handleTagCreated = (newTag: Tag) => {
            onChange([...value, newTag]);
            setShowCreateModal(false);
          };

          const handleCloseModal = () => {
            setShowCreateModal(false);
          };

          return (
            <View style={[styles.container, style]}>
              {label && <Text style={styles.label}>{label}</Text>}

              {value.length > 0 && (
                <View style={styles.tagsContainer}>
                  {value.map((tag: Tag) => (
                    <View
                      key={tag.id}
                      style={[styles.tagChip, tag.color ? { backgroundColor: tag.color } : null]}
                    >
                      <Text style={[styles.tagText, tag.color ? { color: '#FFFFFF' } : null]}>
                        {tag.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => onChange(value.filter((t: Tag) => t.id !== tag.id))}
                      >
                        <Text style={[styles.removeIcon, tag.color ? { color: '#FFFFFF' } : null]}>
                          ✕
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: theme.spacing.s,
                  height: 48,
                }}
              >
                <View style={{ flex: 1, height: '100%' }}>
                  <TextInput
                    style={{ height: '100%' }}
                    onChangeText={setSearchInput}
                    placeholder="Buscar etiquetas..."
                    disabled={disabled}
                    onFocus={onSearchFocus}
                    rightElement={loading ? <Spinner size="small" /> : undefined}
                  />
                </View>

                <TouchableOpacity
                  style={{
                    height: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.colors.primary,
                    paddingHorizontal: theme.spacing.m,
                    borderRadius: theme.spacing.s,
                    ...theme.elevation.level1,
                  }}
                  onPress={() => setShowCreateModal(true)}
                >
                  <Ionicons name="add" size={16} color={theme.colors.onPrimary} />
                  <Text
                    style={{
                      color: theme.colors.onPrimary,
                      fontSize: 14,
                      fontWeight: '600',
                      marginLeft: 4,
                      letterSpacing: 0.5,
                    }}
                  >
                    Crear
                  </Text>
                </TouchableOpacity>
              </View>

              {searchInput.length > 0 && (
                <View style={styles.suggestionContainer}>
                  <ScrollView style={{ maxHeight: 200 }} keyboardShouldPersistTaps="handled">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.suggestionItem}
                          onPress={() => {
                            if (!value.some((t: Tag) => t.id === item.id)) {
                              onChange([...value, item]);
                            }
                            setSearchInput('');
                          }}
                        >
                          <View style={styles.suggestionContent}>
                            <View
                              style={[
                                styles.tagColorIndicator,
                                { backgroundColor: item.color || theme.colors.primary },
                              ]}
                            />
                            <Text style={styles.suggestionText}>{item.name}</Text>
                          </View>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <View style={styles.suggestionItem}>
                        <Text style={styles.noSuggestions}>No se encontraron etiquetas</Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              )}

              {error && <Text style={styles.errorText}>{error?.message}</Text>}

              <Modal
                visible={showCreateModal}
                animationType="slide"
                transparent
                onRequestClose={handleCloseModal}
              >
                <View style={styles.modalOverlay}>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                  >
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Crear Nueva Etiqueta</Text>
                        <TouchableOpacity
                          onPress={handleCloseModal}
                          style={styles.modalCloseButton}
                        >
                          <Ionicons name="close" size={24} color={theme.colors.onSurface} />
                        </TouchableOpacity>
                      </View>

                      <CreateTagForm
                        onSuccess={handleTagCreated}
                        onCancel={handleCloseModal}
                        showTitle={false}
                        autoFocus={true}
                      />
                    </View>
                  </KeyboardAvoidingView>
                </View>
              </Modal>
            </View>
          );
        }}
      />
    </>
  );
};
