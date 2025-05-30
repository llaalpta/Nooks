import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, ScrollView } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { TextInput } from '@/components/atoms/TextInput';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/CreateTagModal.styles';

interface CreateTagModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateTag: (name: string, color: string) => Promise<void>;
  loading?: boolean;
}

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

export function CreateTagModal({ visible, onClose, onCreateTag, loading }: CreateTagModalProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);
  const [tagName, setTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const handleCreate = async () => {
    if (tagName.trim()) {
      await onCreateTag(tagName.trim(), selectedColor);
      setTagName('');
      setSelectedColor(PRESET_COLORS[0]);
      onClose();
    }
  };

  const handleCancel = () => {
    setTagName('');
    setSelectedColor(PRESET_COLORS[0]);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Crear Nueva Etiqueta</Text>
          </View>

          <View style={styles.content}>
            <TextInput
              label="Nombre de la etiqueta"
              value={tagName}
              onChangeText={setTagName}
              placeholder="Ej: Trabajo, Personal, Importante..."
              autoFocus
            />

            <Text style={styles.colorLabel}>Color de la etiqueta</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.colorScroll}
            >
              <View style={styles.colorContainer}>
                {PRESET_COLORS.map((color) => (
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
            </ScrollView>

            {/* Preview del tag */}
            {tagName.trim() && (
              <View style={styles.previewContainer}>
                <Text style={styles.previewLabel}>Vista previa:</Text>
                <View style={[styles.previewTag, { backgroundColor: selectedColor }]}>
                  <Text style={styles.previewTagText}>{tagName.trim()}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.actions}>
            <Button mode="outlined" onPress={handleCancel} style={styles.button}>
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleCreate}
              disabled={!tagName.trim() || loading}
              loading={loading}
              style={styles.button}
            >
              Crear
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
