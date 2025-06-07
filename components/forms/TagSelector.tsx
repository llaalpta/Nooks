import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
  const router = useRouter();
  const theme = useAppTheme();
  const styles = createStyles(theme);

  // Filtra opciones por search input (case-insensitive, ignora tildes y espacios)
  function normalize(str: string) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // quita acentos      .replace(/\s+/g, ''); // quita espacios
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
          // handleCreateTagWithCallback eliminado: ya no se usa, la creación es en página aparte

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
              <View
                style={[
                  styles.searchContainer,
                  { flexDirection: 'row', alignItems: 'center', gap: 8 },
                ]}
              >
                <View
                  style={[
                    styles.inputContainer,
                    { flex: 1 },
                    error && { borderColor: theme.colors.error },
                  ]}
                >
                  <RNTextInput
                    value={searchInput}
                    onChangeText={setSearchInput}
                    placeholder="Buscar etiquetas..."
                    editable={!disabled}
                    style={styles.textInput}
                    onFocus={onSearchFocus}
                  />
                  {loading && <Spinner size="small" style={{ marginRight: 8 }} />}
                </View>
                <Button
                  mode="outlined"
                  onPress={() => router.push('/tags/create')}
                  disabled={disabled}
                  style={[styles.createButton, { flex: 0.25, minWidth: 80, maxWidth: 120 }]}
                  icon={<Ionicons name="add" size={18} color={theme.colors.primary} />}
                >
                  Crear
                </Button>
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

              {/* Modal para crear nueva etiqueta eliminado: ahora es una página independiente */}
            </View>
          );
        }}
      />
    </>
  );
};
