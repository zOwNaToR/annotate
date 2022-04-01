import { ITheme } from './types';

export const LIGHT_THEME: ITheme = {
  name: 'light',
  values: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px',
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.87)',
    colorSecondary: 'rgba(0, 0, 0, 0.6)',
    dividerColor: 'rgba(0, 0, 0, 0.12)',
  },
};

export const DARK_THEME: ITheme = {
  name: 'dark',
  values: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px',
    backgroundColor: '#121212',
    color: '#fff',
    colorSecondary: 'rgba(255, 255, 255, 0.7)',
    dividerColor: 'rgba(255, 255, 255, 0.12)',
  },
};
