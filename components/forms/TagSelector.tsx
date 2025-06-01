import React, { useState, useMemo } from 'react';
import { useFormContext, Controller, Path } from 'react-hook-form';
import {
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  TextInput as RNTextInput,
  ScrollView,
} from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Spinner } from '@/components/atoms/Spinner';
import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

import { CreateTagModal } from './CreateTagModal';
import { createStyles } from './styles/TagSelector.styles';

import type { Tag } from '../../features/tags/hooks';

interface TagSelectorProps<T extends object> {
  name: Path<T>;
  label?: string;
  options: Tag[];
  loading?: boolean;
  onCreateTag?: (name: string, color: string) => Promise<Tag | null>;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const TagSelector = <T extends object>({
  name,
  label,
  options,
  loading,
  onCreateTag,
  disabled,
  style,
}: TagSelectorProps<T>) => {
  const { control } = useFormContext<T>();
  const [searchInput, setSearchInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const theme = useAppTheme();
  const styles = createStyles(theme);

  // Filtra opciones por search input (case-insensitive)
  const filteredOptions = useMemo(
    () => options.filter((tag) => tag.name.toLowerCase().includes(searchInput.toLowerCase())),
    [searchInput, options]
  );

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { value = [], onChange }, fieldState: { error } }) => {
          const handleCreateTagWithCallback = async (name: string, color: string) => {
            if (!onCreateTag) return;

            setCreating(true);
            try {
              const newTag = await onCreateTag(name, color);
              if (newTag) {
                // Agregar el nuevo tag a la selección actual
                onChange([...value, newTag]);
              }
            } catch (error) {
              console.error('Error creating tag:', error);
            } finally {
              setCreating(false);
            }
          };

          return (
            <View style={[styles.container, style]}>
              {label && <Text style={styles.label}>{label}</Text>}

              {/* Tags seleccionados */}
              {value.length > 0 && (
                <View style={styles.tagsContainer}>
                  {value.map((tag: Tag) => (
                    <View
                      key={tag.id}
                      style={[styles.tagChip, tag.color ? { backgroundColor: tag.color } : null]}
                    >
                      <Text style={styles.tagText}>{tag.name}</Text>
                      <TouchableOpacity
                        onPress={() => onChange(value.filter((t: Tag) => t.id !== tag.id))}
                      >
                        <Text style={styles.removeIcon}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Contenedor de búsqueda y creación */}
              <View style={styles.searchContainer}>
                {/* Input de búsqueda */}
                <View style={[styles.inputContainer, error && { borderColor: theme.colors.error }]}>
                  <RNTextInput
                    value={searchInput}
                    onChangeText={setSearchInput}
                    placeholder="Buscar etiquetas..."
                    editable={!disabled}
                    style={styles.textInput}
                  />
                  {loading && <Spinner size="small" style={{ marginRight: 8 }} />}
                </View>
                {/* Botón para crear nueva etiqueta */}
                {onCreateTag && (
                  <Button
                    mode="outlined"
                    onPress={() => setShowCreateModal(true)}
                    disabled={disabled || creating}
                    loading={creating}
                    style={styles.createButton}
                    icon="plus"
                  >
                    Crear etiqueta
                  </Button>
                )}
              </View>

              {/* Lista de sugerencias */}
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

              {/* Modal para crear nueva etiqueta */}
              <CreateTagModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreateTag={handleCreateTagWithCallback}
                loading={creating}
              />
            </View>
          );
        }}
      />
    </>
  );
};
