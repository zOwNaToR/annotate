import { KeyAction, Row } from '@/components/content-editable/types';
import {
  deleteSelectedRows,
  getFirstSelectedRow,
  markSelectedRows,
  shouldDeleteSelectedRows,
} from '@/components/content-editable/logic/selection/selection';
import { deleteCharFromRow, unfocusAllRows } from '@/components/content-editable/logic/main/logic';

export const handleBackspace: KeyAction = (currentRows: Row[]) => {
  const rowsWithSelection = markSelectedRows(currentRows);
  let rows = unfocusAllRows(rowsWithSelection);

  if (shouldDeleteSelectedRows(rows)) {
    rows = deleteSelectedRows(rows);

    // After deleting selected rows, we need to get the first selected row because now it's the focused row
    const firstSelectedRow = getFirstSelectedRow(rows)!;
    firstSelectedRow.focusColumn = firstSelectedRow.startColumn!;
  } else {
    const firstSelectedRow = getFirstSelectedRow(rows);
    if (!firstSelectedRow) return rows;

    rows = deleteCharFromRow(rows, firstSelectedRow);
  }

  return rows;
};

export const handleDelete: KeyAction = (currentRows: Row[]) => {
  const rowsWithSelection = markSelectedRows(currentRows);
  let rows = unfocusAllRows(rowsWithSelection);

  if (shouldDeleteSelectedRows(rows)) {
    rows = deleteSelectedRows(rows);

    // After deleting selected rows, we need to get the first selected row because now it's the focused row
    const firstSelectedRow = getFirstSelectedRow(rows)!;
    firstSelectedRow.focusColumn = firstSelectedRow.startColumn!;
  } else {
    const firstSelectedRow = getFirstSelectedRow(rows);
    if (!firstSelectedRow) return rows;

    rows = deleteCharFromRow(rows, firstSelectedRow, true);
  }

  return rows;
};
