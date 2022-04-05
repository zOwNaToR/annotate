import { ITheme } from '@/context/theme';
import { UnmappedCssInJsThemeProperties } from '@/context/theme/constants';
import { CHARS_AND_NUMBERS } from '@/utils/constants';

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

export const removeCharsFromString = (str: string, start: number, end: number) => {
  return str.slice(0, start) + str.slice(end);
};

export const generateRandomId = (length: number): string => {
  let charactersLength = CHARS_AND_NUMBERS.length;

  return createArray(length).reduce((acc) => {
    return acc + CHARS_AND_NUMBERS.charAt(Math.floor(Math.random() * charactersLength));
  }, '');
};
