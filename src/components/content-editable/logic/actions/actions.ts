import { splitRow } from '../logic';
import { AddRowActionParams, AddTextActionParams, DeleteRowActionParams, DeleteTextActionParams } from './types';
import { addTextAtPosition, removeCharsFromString } from '@/components/content-editable/logic/utils/utils';

export const addRowAction = ({
  currentRows,
  rowToAdd,
  insertRowAtIndex,
  insertColumnAtIndex,
  shouldFocusNewRow,
}: AddRowActionParams) => {
  const currentRow = currentRows[insertRowAtIndex - 1];

  const [, newRow] = splitRow(currentRow, insertColumnAtIndex);
  newRow.text = `${rowToAdd.text}${newRow.text}`;
  newRow.key = rowToAdd.key;

  if (shouldFocusNewRow) {
    newRow.focusColumn = rowToAdd.text.length;
  }

  currentRows.splice(insertRowAtIndex, 0, newRow);
  return currentRows;
};

export const deleteRowAction = ({ currentRows, deleteRowIndex, shouldFocusPrecedentRow }: DeleteRowActionParams) => {
  if (shouldFocusPrecedentRow) {
    const precedentRow = currentRows[deleteRowIndex - 1];
    precedentRow.focusColumn = precedentRow.text.length;
  }

  currentRows.splice(deleteRowIndex, 1);
  return currentRows;
};

export const addTextAction = ({
  currentRows,
  shouldFocusAtEndOfAddedText,
  insertText,
  rowIndex,
  columnIndex,
}: AddTextActionParams) => {
  const rowToUpdate = currentRows[rowIndex];
  rowToUpdate.text = addTextAtPosition(rowToUpdate.text, columnIndex, insertText);

  if (shouldFocusAtEndOfAddedText) {
    rowToUpdate.focusColumn = columnIndex + insertText.length;
  }

  return currentRows;
};

export const deleteTextAction = ({
  currentRows,
  shouldFocus,
  startColumnIndex,
  endColumnIndex,
  rowIndex,
}: DeleteTextActionParams) => {
  const rowToUpdate = currentRows[rowIndex];
  rowToUpdate.text = removeCharsFromString(rowToUpdate.text, startColumnIndex, endColumnIndex);

  if (shouldFocus) {
    rowToUpdate.focusColumn = startColumnIndex;
  }

  return currentRows;
};

// export const paste = ({ rows, rowsToAdd, insertAtColumn, focusNewRow }: AddRowsParams) => {
//   const smallestIndex = Math.min(...rowsToAdd.map((row) => row.index));
//   const currentRowAtSmallestIndex = rows[smallestIndex];
//
//   const [, newRow2] = splitRow(currentRowAtSmallestIndex, insertAtColumn);
//
//   if (focusNewRow) {
//     newRow2.focusColumn = 0;
//   }
//
//   rows.splice(rowToAdd.index, 0, newRow2);
//   return rows;
// };
