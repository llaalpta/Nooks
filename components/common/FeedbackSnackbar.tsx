import React from 'react';

import { Snackbar } from '@/components/atoms/Snackbar';

interface FeedbackSnackbarProps {
  visible: boolean;
  onDismiss: () => void;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export function FeedbackSnackbar({
  visible,
  onDismiss,
  message,
  type = 'info',
  duration = 1500,
}: FeedbackSnackbarProps) {
  // Mapear 'warning' a 'info' ya que el componente Snackbar subyacente puede no soportar 'warning'
  const mappedType = type === 'warning' ? 'info' : type;

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      type={mappedType}
      action={{
        label: 'OK',
        onPress: onDismiss,
      }}
    >
      {message}
    </Snackbar>
  );
}
