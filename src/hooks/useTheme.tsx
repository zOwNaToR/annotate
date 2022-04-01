import { useContext } from 'react';
import { ThemeContext } from '@/context/theme';

export const useTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return [theme, setTheme] as const;
};
