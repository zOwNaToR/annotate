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
