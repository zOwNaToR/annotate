import { KeyMap, Row, RowWithSelectedInfo } from '@/components/content-editable/types';
import { removeCharsFromString, removeSpacesFromString } from '@/utils/utils';

export const deleteSelectedRows = (rows: RowWithSelectedInfo[], deleteFromEnd: boolean): RowWithSelectedInfo[] => {
  rows = removeFullySelectedRows(rows);
  rows = removeSelectedTextFromRows(rows);

  return rows;
};

export const removeFullySelectedRows = (rows: RowWithSelectedInfo[]) => {
  return rows.filter((row) => {
    if (!row.selected) return true;

    // Keep first row and rows that are not fully selected
    return row.isStartingRow || !isFullySelectedRow(row);
  });
};

export const removeSelectedTextFromRows = (rows: RowWithSelectedInfo[]) => {
  return rows.map((row) => {
    if (!row.selected) return row;

    row.text = removeCharsFromString(row.text, row.startColumn, row.endColumn);
    return row;
  });
};

export const shouldPreventDefault = ({ preventDefault }: KeyMap, ctrlKey: boolean, shiftKey: boolean) => {
  return typeof preventDefault === 'boolean' ? preventDefault : preventDefault(ctrlKey, shiftKey);
};

export const getRowByKey = (rows: Row[], key: string) => {
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
