import React from 'react';
import { Modal, Pressable, View } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './Dialog.styles';

export interface DialogProps {
  visible: boolean;
  title?: string;
  description?: string;
  subdescription?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmColor?: string;
  cancelColor?: string;
  loading?: boolean;
}

export function Dialog({
  visible,
  title,
  description,
  subdescription,
  confirmLabel = 'Aceptar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  confirmColor,
  cancelColor,
  loading = false,
}: DialogProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel} />
      <View style={styles.dialog}>
        {title && (
          <Text variant="titleLarge" style={styles.title}>
            {title}
          </Text>
        )}
        {description && (
          <Text variant="bodyLarge" style={styles.description}>
            {description}
          </Text>
        )}
        {subdescription && (
          <Text variant="bodyMedium" style={styles.subdescription}>
            {subdescription}
          </Text>
        )}
        <View style={styles.actions}>
          <Button
            mode="outlined"
            style={[styles.button, { borderColor: cancelColor || theme.colors.outline }]}
            labelStyle={{ color: cancelColor || theme.colors.onSurfaceVariant }}
            onPress={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            mode="contained"
            style={[styles.button, { backgroundColor: confirmColor || theme.colors.error }]}
            labelStyle={{ color: theme.colors.onError }}
            onPress={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </View>
      </View>
    </Modal>
  );
}
