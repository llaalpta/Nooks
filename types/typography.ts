import { TextStyle } from 'react-native';

export type TextVariant =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall';

export interface AppFonts {
  regular: {
    fontFamily: string;
    fontWeight: string;
  };
  medium: {
    fontFamily: string;
    fontWeight: string;
  };
  light: {
    fontFamily: string;
    fontWeight: string;
  };
  thin: {
    fontFamily: string;
    fontWeight: string;
  };
}

export type TextStylesProps = TextStyle;

export type TextStyles = {
  [key in TextVariant]: TextStylesProps;
} & {
  base: TextStylesProps;
  textCenter: TextStylesProps;
  textLeft: TextStylesProps;
  textRight: TextStylesProps;
  mb1: TextStylesProps;
  mb2: TextStylesProps;
  mb3: TextStylesProps;
  mb4: TextStylesProps;
  mb5: TextStylesProps;
};
