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

export interface AppBorderRadius {
  xs: number; // Extra Small: 4dp
  s: number; // Small: 8dp
  m: number; // Medium: 12dp
  l: number; // Large: 16dp
  xl: number; // Extra Large: 24dp
  xxl: number; // Extra Extra Large: 32dp
  xxxl: number; // Extra Extra Extra Large: 40dp
  round: number; // completely rounded: 50%
}

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
