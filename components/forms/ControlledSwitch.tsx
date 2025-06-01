import React from 'react';
import { useFormContext, Controller, Path } from 'react-hook-form';
import { StyleProp, View, ViewStyle } from 'react-native';

import { Switch } from '@/components/atoms/Switch';
import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/ControlledSwitch.styles';

interface ControlledSwitchProps<T extends object> {
  name: Path<T>;
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ControlledSwitch = <T extends object>({
  name,
  label,
  disabled,
  style,
}: ControlledSwitchProps<T>) => {
  const { control } = useFormContext<T>();
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={[styles.container, style]}>
          {label && <Text style={styles.label}>{label}</Text>}
          <Switch value={!!value} onValueChange={onChange} disabled={disabled} />
          {error && <Text style={styles.errorText}>{error?.message}</Text>}
        </View>
      )}
    />
  );
};
