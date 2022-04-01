import { useContext } from 'react';
import { ITheme, LIGHT_THEME, ThemeContext } from '@/context/theme';
import { DARK_THEME } from '@/context/theme/constants';

export const useTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    setTheme((prev) => getOppositeTheme(prev));
  };

  const getOppositeTheme = (currentTheme?: ITheme) => {
    currentTheme ??= theme;

    return currentTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
  };

  return [theme, setTheme, toggleTheme, getOppositeTheme] as const;
};
