import { createContext } from 'react';
import { IThemeContext } from './types';
import { LIGHT_THEME } from './constants';

export const ThemeContext = createContext<IThemeContext>({
  theme: LIGHT_THEME,
  setTheme: () => {},
});
