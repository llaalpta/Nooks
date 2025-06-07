import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { TextInput } from '@/components/atoms/TextInput';
import { createStyles } from '@/components/forms/styles/CreateTagModal.styles';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useCreateTagMutation } from '@/features/tags/hooks';

const PRESET_COLORS = [
  '#FF6B6B', // Rojo suave
  '#4ECDC4', // Verde azulado
  '#45B7D1', // Azul
  '#96CEB4', // Verde menta
  '#FECA57', // Amarillo
  '#FF9FF3', // Rosa
  '#54A0FF', // Azul claro
  '#5F27CD', // Púrpura
  '#00D2D3', // Cian
  '#FF9F43', // Naranja
  '#1DD1A1', // Verde
  '#C44569', // Rosa oscuro
];

export default function CreateTagModal() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { user } = useAuth();
  const createTagMutation = useCreateTagMutation();
  const [tagName, setTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setError(null);
    if (!tagName.trim()) return;
    if (!user?.id) {
      setError('Debes iniciar sesión para crear una etiqueta.');
      return;
    }
    try {
      await createTagMutation.mutateAsync({
        name: tagName.trim(),
        color: selectedColor,
        user_id: user.id,
      });
      router.back();
    } catch (e: any) {
      setError(e?.message || 'Error al crear la etiqueta');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={60}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.modal,
            { alignSelf: 'stretch', width: '100%', maxWidth: '100%', marginTop: 0 },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Crear Nueva Etiqueta</Text>
          </View>

          <View style={[styles.content, { marginTop: 16, padding: 2 }]}>
            <TextInput
              label="Nombre de la etiqueta"
              value={tagName}
              onChangeText={setTagName}
              placeholder="Ej: Trabajo, Personal, Importante..."
              autoFocus
            />

            <Text style={styles.colorLabel}>Color de la etiqueta</Text>
            <View style={styles.colorGridContainer}>
              {[0, 1].map((row) => (
                <View key={row} style={[styles.colorGridRow, { justifyContent: 'center' }]}>
                  {PRESET_COLORS.slice(row * 6, row * 6 + 6).map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === color && styles.selectedColor,
                      ]}
                      onPress={() => setSelectedColor(color)}
                    />
                  ))}
                </View>
              ))}
            </View>

            {/* Preview del tag */}
            {tagName.trim() && (
              <View style={styles.previewContainer}>
                <Text style={styles.previewLabel}>Vista previa:</Text>
                <View style={[styles.previewTag, { backgroundColor: selectedColor }]}>
                  <Text style={styles.previewTagText}>{tagName.trim()}</Text>
                </View>
              </View>
            )}
            {error && <Text style={{ color: theme.colors.error, marginTop: 8 }}>{error}</Text>}
          </View>

          <View style={styles.actions}>
            <Button mode="outlined" onPress={() => router.back()} style={styles.button}>
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleCreate}
              disabled={!tagName.trim() || createTagMutation.isPending}
              loading={createTagMutation.isPending}
              style={styles.button}
            >
              Crear
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
