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
  onCreateTag?: (name: string) => Promise<Tag | null>;
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
  const [input, setInput] = useState('');
  const [creating, setCreating] = useState(false);
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);

  // Filtra opciones por input (case-insensitive)
  const filteredOptions = useMemo(
    () =>
      options.filter(
        (tag) => tag.name.toLowerCase().includes(input.toLowerCase()) && input.trim() !== ''
      ),
    [input, options]
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value = [], onChange }, fieldState: { error } }) => (
        <View style={[styles.container, style]}>
          {label && <Text style={styles.label}>{label}</Text>}

          <View style={[styles.inputContainer, error && { borderColor: theme.colors.error }]}>
            {/* Tags seleccionados */}
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

            {/* Input para buscar o crear tags */}
            <RNTextInput
              value={input}
              onChangeText={setInput}
              placeholder="Buscar o crear etiqueta..."
              editable={!disabled}
              style={{ flex: 1, minWidth: 120 }}
            />

            {/* Indicador de carga */}
            {(loading || creating) && <Spinner size="small" style={{ marginRight: 8 }} />}
          </View>

          {/* Sugerencias */}
          {input.length > 0 && (
            <View style={styles.suggestionContainer}>
              <ScrollView style={{ maxHeight: 200 }} keyboardShouldPersistTaps="handled">
                {filteredOptions.length > 0 &&
                  filteredOptions.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.suggestionItem}
                      onPress={() => {
                        if (!value.some((t: Tag) => t.id === item.id)) {
                          onChange([...value, item]);
                        }
                        setInput('');
                      }}
                    >
                      <Text style={styles.suggestionText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                {/* Mostrar opción de crear tag si no hay coincidencia exacta y el input no está vacío */}
                {onCreateTag &&
                  !loading &&
                  !creating &&
                  input.trim() !== '' &&
                  !options.some((tag) => tag.name.toLowerCase() === input.trim().toLowerCase()) && (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={async () => {
                        if (input.trim() === '') return;
                        setCreating(true);
                        const newTag = await onCreateTag(input.trim());
                        setCreating(false);
                        if (newTag) {
                          onChange([...value, newTag]);
                          setInput('');
                        }
                      }}
                    >
                      <Text style={styles.suggestionText}>Crear "{input.trim()}"</Text>
                    </TouchableOpacity>
                  )}
                {/* Si no hay sugerencias ni opción de crear */}
                {filteredOptions.length === 0 &&
                  (!onCreateTag ||
                    loading ||
                    creating ||
                    input.trim() === '' ||
                    options.some(
                      (tag) => tag.name.toLowerCase() === input.trim().toLowerCase()
                    )) && (
                    <View style={styles.suggestionItem}>
                      <Text style={styles.noSuggestions}>No hay sugerencias</Text>
                    </View>
                  )}
              </ScrollView>
            </View>
          )}

          {error && <Text style={styles.errorText}>{error?.message}</Text>}
        </View>
      )}
    />
  );
};
