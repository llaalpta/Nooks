import React, { useState } from 'react';
import { useFormContext, Controller, Path } from 'react-hook-form';
import {
  StyleProp,
  View,
  ViewStyle,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';

import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/ControlledSelect.styles';

interface Option {
  label: string;
  value: string | number;
}

interface ControlledSelectProps<T extends object> {
  name: Path<T>;
  label?: string;
  options: Option[];
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ControlledSelect = <T extends object>({
  name,
  label,
  options,
  disabled,
  style,
}: ControlledSelectProps<T>) => {
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
          <View style={[styles.selectContainer, error && styles.selectContainerError]}>
            <TouchableOpacity
              style={styles.selectContainer} // Cambiado selectButton por selectContainer
              onPress={() => !disabled && setVisible(true)}
              disabled={disabled}
            >
              <Text style={[value ? styles.selectedText : styles.placeholderText]}>
                {options.find((opt) => opt.value === value)?.label || 'Selecciona una opción'}
              </Text>
              <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>
          </View>
          {error && <Text style={styles.errorText}>{error?.message}</Text>}
          <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setVisible(false)}
          >
            <Pressable
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'flex-end',
              }}
              onPress={() => setVisible(false)}
            >
              <View
                style={{
                  backgroundColor: theme.colors.surface,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  padding: 16,
                  maxHeight: '70%',
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    marginBottom: 16,
                    textAlign: 'center',
                  }}
                >
                  {label || 'Selecciona una opción'}
                </Text>
                <FlatList
                  data={options}
                  keyExtractor={(item) => item.value.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.optionItem}
                      onPress={() => {
                        onChange(item.value);
                        setVisible(false);
                      }}
                    >
                      <Text style={styles.optionText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </Pressable>
          </Modal>
        </View>
      )}
    />
  );
};
