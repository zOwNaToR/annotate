import { KeyAction, Row } from '@/components/content-editable/types';
import {
  deleteSelectedRows,
  getFirstSelectedRow,
  markSelectedRows,
  shouldDeleteSelectedRows,
} from '@/components/content-editable/logic/selection.logic';
import { deleteCharFromRow, unfocusAllRows } from '@/components/content-editable/logic/logic';

export const handleBackspace: KeyAction = (currentRows: Row[]) => {
  const rows = unfocusAllRows(currentRows);
  let rowsWithSelection = markSelectedRows(rows);

  if (shouldDeleteSelectedRows(rowsWithSelection)) {
    rowsWithSelection = deleteSelectedRows(rowsWithSelection);

    // After deleting selected rows, we need to get the first selected row because now it's the focused row
    const firstSelectedRow = getFirstSelectedRow(rowsWithSelection)!;
    firstSelectedRow.focusColumn = firstSelectedRow.startColumn!;
  } else {
    const firstSelectedRow = getFirstSelectedRow(rowsWithSelection);
    if (!firstSelectedRow) return rowsWithSelection;

    rowsWithSelection = deleteCharFromRow(rowsWithSelection, firstSelectedRow);
  }

  return rowsWithSelection;
};

export const handleDelete: KeyAction = (currentRows: Row[]) => {
  const rows = unfocusAllRows(currentRows);
  let rowsWithSelection = markSelectedRows(rows);

  if (shouldDeleteSelectedRows(rowsWithSelection)) {
    rowsWithSelection = deleteSelectedRows(rowsWithSelection);

    // After deleting selected rows, we need to get the first selected row because now it's the focused row
    const firstSelectedRow = getFirstSelectedRow(rowsWithSelection)!;
    firstSelectedRow.focusColumn = firstSelectedRow.startColumn!;
  } else {
    const firstSelectedRow = getFirstSelectedRow(rowsWithSelection);
    if (!firstSelectedRow) return rowsWithSelection;

    rowsWithSelection = deleteCharFromRow(rowsWithSelection, firstSelectedRow, true);
  }

  return rowsWithSelection;
};
