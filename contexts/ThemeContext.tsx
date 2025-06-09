import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { lightTheme, darkTheme } from '@/src/theme/theme';
import { AppTheme, ThemeMode } from '@/types/theme';

type ThemeContextType = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  theme: AppTheme;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [theme, setTheme] = useState<AppTheme>(colorScheme === 'dark' ? darkTheme : lightTheme);

  // update theme based on themeMode and colorScheme
  useEffect(() => {
    let newTheme: AppTheme;
    if (themeMode === 'system') {
      newTheme = colorScheme === 'dark' ? darkTheme : lightTheme;
    } else {
      newTheme = themeMode === 'dark' ? darkTheme : lightTheme;
    }
    setTheme(newTheme);
  }, [themeMode, colorScheme]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context.theme;
};
