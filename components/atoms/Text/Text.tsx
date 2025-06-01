import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';
import { TextVariant } from '@/types/typography';

import { createStyles } from './Text.styles';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  center?: boolean;
  left?: boolean;
  right?: boolean;
  mb1?: boolean;
  mb2?: boolean;
  mb3?: boolean;
  mb4?: boolean;
  mb5?: boolean;
  color?: string;
}

export function Text({
  variant = 'bodyMedium',
  center,
  left,
  right,
  mb1,
  mb2,
  mb3,
  mb4,
  mb5,
  color,
  style,
  ...props
}: TextProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  // Crear un array con los estilos aplicables
  const textStylesArray = [
    styles.base,
    styles[variant],
    center && styles.textCenter,
    left && styles.textLeft,
    right && styles.textRight,
    mb1 && styles.mb1,
    mb2 && styles.mb2,
    mb3 && styles.mb3,
    mb4 && styles.mb4,
    mb5 && styles.mb5,
    color && ({ color } as TextStyle),
    style,
  ].filter(Boolean) as TextStyle[];

  return <RNText style={textStylesArray} {...props} />;
}
