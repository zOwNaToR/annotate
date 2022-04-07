import { KeyMap, Row, RowWithSelectedInfo } from '@/components/content-editable/types';
import { removeSpacesFromString } from '@/utils/utils';

export const shouldPreventDefault = ({ preventDefault }: KeyMap, ctrlKey: boolean, shiftKey: boolean) => {
  return typeof preventDefault === 'boolean' ? preventDefault : preventDefault(ctrlKey, shiftKey);
};

export const getRowByKey = <T extends Row>(rows: T[], key: string) => {
  return rows.find((x) => x.key === key);
};

export const isFullySelectedRow = (row: RowWithSelectedInfo) => {
  return (
    row.selected && (row.isMiddleRow || removeSpacesFromString(row.text).length === row.startColumn + row.endColumn)
  );
};

export const addTextToRow = (focusedRow: Row, text: string, position: number) => {
  return focusedRow.text.slice(0, position) + text + focusedRow.text.slice(position);
};

export const orderRows = <T extends Row>(rows: T[]): T[] => {
  return rows.sort((curr, next) => curr.index - next.index);
};
