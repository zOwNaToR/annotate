import { ReactSetState } from '@/utils/types';

export interface IThemeContext {
  theme: ITheme;
  setTheme?: ReactSetState<ITheme>;
}

export interface ITheme {
  name: string;
  values: IThemeValues;
}

export interface IThemeValues {
  fontFamily: string;
  fontSize: string;
  backgroundColor: string;
  color: string;
}
