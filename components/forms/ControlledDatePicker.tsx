import React, { useState } from 'react';
import { useFormContext, Controller, Path } from 'react-hook-form';
import { StyleProp, View, ViewStyle, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/ControlledDatePicker.styles';

interface ControlledDatePickerProps<T extends object> {
  name: Path<T>;
  label?: string;
  mode?: 'date' | 'time' | 'datetime';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ControlledDatePicker = <T extends object>({
  name,
  label,
  mode = 'date',
  disabled,
  style,
}: ControlledDatePickerProps<T>) => {
  const { control } = useFormContext<T>();
  const [visible, setVisible] = useState(false);
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={[styles.container, style]}>
          {label && <Text style={styles.label}>{label}</Text>}

          <View style={[styles.inputContainer, error && styles.inputContainerError]}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => !disabled && setVisible(true)}
              disabled={disabled}
            >
              <Text style={[styles.dateText, !value && styles.datePlaceholder]}>
                {value ? new Date(value).toLocaleDateString() : 'Selecciona una fecha'}
              </Text>
              <Text>📅</Text>
            </TouchableOpacity>
          </View>

          <DateTimePickerModal
            isVisible={visible}
            mode={mode}
            date={value ? new Date(value) : new Date()}
            onConfirm={(date) => {
              setVisible(false);
              onChange(date.toISOString());
            }}
            onCancel={() => setVisible(false)}
          />

          {error && <Text style={styles.errorText}>{error?.message}</Text>}
        </View>
      )}
    />
  );
};
