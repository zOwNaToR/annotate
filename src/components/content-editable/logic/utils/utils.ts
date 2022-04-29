import { KeyMap, Row, RowWithSelectedInfo } from '@/components/content-editable/types';

export const shouldPreventDefault = ({ preventDefault }: KeyMap, ctrlKey: boolean, shiftKey: boolean) => {
  return typeof preventDefault === 'boolean' ? preventDefault : preventDefault(ctrlKey, shiftKey);
};

export const getRowByKey = <T extends Row>(rows: T[], key: string) => {
  return rows.find((x) => x.key === key);
};

export const addTextToRow = (focusedRow: RowWithSelectedInfo, text: string, position: number) => {
  return focusedRow.text.slice(0, position) + text + focusedRow.text.slice(position);
};

export const mapRowsWithSelectionToRow = (rows: RowWithSelectedInfo[]) => {
  return rows.map((x) => ({ key: x.key, text: x.text, focusColumn: x.focusColumn }));
};

// New
export const splitText = (text: string, position: number) => {
  return [text.slice(0, position), text.slice(position)] as const;
};

export const addTextAtPosition = (text: string, position: number, textToAdd: string) => {
  return text.slice(0, position) + textToAdd + text.slice(position);
};

export const removeCharsFromString = (text: string, from: number, to: number) => {
  return text.slice(0, from) + text.slice(to);
};

export const removeSpacesFromString = (text: string) => {
  return text.replace(/\s/g, '');
};
