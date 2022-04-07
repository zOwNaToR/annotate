import { KeyMap, Row, SelectedRow, SelectionType } from '@/components/content-editable/types';
import { removeCharsFromString, removeSpacesFromString } from '@/utils/utils';

export const shouldPreventDefault = ({ preventDefault }: KeyMap, ctrlKey: boolean, shiftKey: boolean) => {
  return typeof preventDefault === 'boolean' ? preventDefault : preventDefault(ctrlKey, shiftKey);
};

export const getRowByKey = (rows: Row[], key: string) => {
  return rows.find((x) => x.key === key);
};

export const isFullySelectedRow = (selectedRow: SelectedRow) => {
  return (
    selectedRow.isMiddleRow ||
    removeSpacesFromString(selectedRow.text).length === selectedRow.startColumn + selectedRow.endColumn
  );
};

export const addTextToRow = (focusedRow: Row, text: string, position: number) => {
  return focusedRow.text.slice(0, position) + text + focusedRow.text.slice(position);
};

export const deleteSelection = (rows: Row[], selection: SelectionType, deleteFromEnd: boolean) => {
  const { type, selectedRows } = selection;

  if (type === 'Caret') {
    const selectedRow = selectedRows[0];
    const row = getRowByKey(rows, selectedRow.key)!;

    if (deleteFromEnd) {
      row.text = removeCharsFromString(row.text, selectedRow.startColumn - 1, selectedRow.startColumn);
    } else {
      row.text = removeCharsFromString(row.text, selectedRow.startColumn, selectedRow.startColumn + 1);
    }

    return rows;
  }

  rows = removeFullySelectedRows(rows, selectedRows);
  rows = removeSelectedTextFromPartiallySelectedRows(rows, selectedRows);

  return rows;
};
export const removeFullySelectedRows = (rows: Row[], selectedRows: SelectedRow[]) => {
  return rows.filter((row) => {
    const selectedRow = selectedRows.find((x) => x.key === row.key);

    // Keep unselected rows, first row and rows that are not fully selected
    const willKeepRow = !selectedRow || selectedRow.isStartingRow || !isFullySelectedRow(selectedRow);
    return willKeepRow;
  });
};
export const removeSelectedTextFromPartiallySelectedRows = (rows: Row[], selectedRows: SelectedRow[]) => {
  return rows.map((row) => {
    const selectedRow = selectedRows.find((x) => x.key === row.key);
    if (!selectedRow) return row;

    row.text = removeCharsFromString(row.text, selectedRow.startColumn, selectedRow.endColumn);
    return row;
  });
};
