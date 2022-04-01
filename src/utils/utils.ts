import { ITheme } from '@/context/theme';
import { UnmappedCssInJsThemeProperties } from '@/context/theme/constants';

export const createArray = (length: number, startNumber: number = 0) => {
  return Array.from({ length: length }, (_, i) => i + startNumber);
};

export const convertThemeToCssInJs = (theme: ITheme) => {
  return Object.entries(theme.values)
    .filter((prop) => !UnmappedCssInJsThemeProperties.includes(prop[0]))
    .reduce(
      (acc, curr) => ({
        ...acc,
        [curr[0]]: curr[1],
      }),
      {},
    );
};
