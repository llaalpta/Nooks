// Tipos para los espaciados
export interface AppSpacing {
  xs: number;
  s: number;
  sm: number;
  m: number;
  ml: number;
  l: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

// Tipos para border radius según MD3
export interface AppBorderRadius {
  xs: number; // Extra Small: 4dp
  s: number; // Small: 8dp
  m: number; // Medium: 12dp
  l: number; // Large: 16dp
  xl: number; // Extra Large: 24dp
  round: number; // Completamente redondeado: 50%
}

// Tipos para elevación/sombras según MD3
export interface AppElevation {
  level0: {
    elevation: number;
    shadowOpacity: number;
  };
  level1: {
    elevation: number;
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
  };
  level2: {
    elevation: number;
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
  };
  level3: {
    elevation: number;
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
  };
  level4: {
    elevation: number;
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
  };
  level5: {
    elevation: number;
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
  };
}
