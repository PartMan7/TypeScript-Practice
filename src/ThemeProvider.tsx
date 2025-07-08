import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark';

const ThemeContext = createContext<Theme>('dark');

export const useTheme = () => {
  return useContext(ThemeContext);
};
export const ThemeProvider = ThemeContext.Provider;
