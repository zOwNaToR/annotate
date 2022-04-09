import React from 'react';
import { Row, RowWithSelectedInfo } from '@/components/content-editable/types';
import {
  deleteSelectedRows,
  getFirstSelectedRow,
  markSelectedRows,
  shouldDeleteSelectedRows,
} from '@/components/content-editable/logic/selection.logic';
import { ENTER_INPUT_EVENT_DATA, KEY_ACTION_MAP } from '@/components/content-editable/constants';
import { generateRandomId } from '@/utils/utils';
import {
  addTextToRow,
  getRowByKey,
  mapRowsWithSelectionToRow,
  shouldPreventDefault,
} from '@/components/content-editable/logic/utils.logic';

// Entrypoint - Functions for handling events
export const onInputLogic = (e: React.KeyboardEvent<HTMLDivElement>, currentRows: Row[]): Row[] => {
  e.preventDefault();

  // @ts-ignore
  const data: string = e.data;

  const rows = unfocusAllRows(currentRows);
  let rowsWithSelection = markSelectedRows(rows);

  if (shouldDeleteSelectedRows(rowsWithSelection)) {
    rowsWithSelection = deleteSelectedRows(rowsWithSelection);
  }

  // After deleting selected rows, we need to get the first selected row because now it's the focused row
  const firstSelectedRow = getFirstSelectedRow(rowsWithSelection)!;

  if (data === ENTER_INPUT_EVENT_DATA) {
    rowsWithSelection = addNewRowWithFocus(rowsWithSelection, firstSelectedRow.index, firstSelectedRow.endColumn!);
  } else {
    firstSelectedRow.text = addTextToRow(firstSelectedRow, data, firstSelectedRow.startColumn!);
    firstSelectedRow.focusColumn = firstSelectedRow.startColumn! + data.length;
  }

  return mapRowsWithSelectionToRow(rowsWithSelection);
};

export const onShortcutLogic = (e: React.KeyboardEvent<HTMLDivElement>, currentRows: Row[]): Row[] => {
  if (!(e.key in KEY_ACTION_MAP)) return currentRows;

  const { ctrlKey, shiftKey } = e;
  const keyMap = KEY_ACTION_MAP[e.key];

  if (shouldPreventDefault(keyMap, ctrlKey, shiftKey)) e.preventDefault();

  return mapRowsWithSelectionToRow(keyMap.action(currentRows, ctrlKey, shiftKey));
};

// Helper functions
const addNewRowWithFocus = (rows: RowWithSelectedInfo[], insertAtRow: number, insertAtColumn: number) => {
  const sourceRow = rows[insertAtRow];

  const [, newRow] = splitRow(sourceRow, insertAtColumn);

  rows.splice(newRow.index, 0, newRow);
  return rows;
};

const splitRow = (
  sourceRow: RowWithSelectedInfo,
  splitFromColumn: number,
): [RowWithSelectedInfo, RowWithSelectedInfo] => {
  // Create new row with text copied from sourceRow, from "splitFromColumn" to the end of the row.
  const newRow: RowWithSelectedInfo = {
    ...sourceRow,
    key: generateRandomId(5),
    text: sourceRow.text.slice(splitFromColumn, sourceRow.text.length),
    focusColumn: 0,
    index: sourceRow.index + 1,
  };

  // Remove text after insertAtColumn
  sourceRow.text = sourceRow.text.removeChars(splitFromColumn, sourceRow.text.length);

  return [sourceRow, newRow];
};

export const mergeRows = (startingRow: RowWithSelectedInfo, endingRow: RowWithSelectedInfo): RowWithSelectedInfo => {
  if (!startingRow.selected) {
    // If not selected the focus is on the ending row and the User pressed 'Delete'
    return {
      selected: true,
      key: startingRow.key,
      text: `${startingRow.text}${endingRow.text}`,
      isStartingRow: true,
      isMiddleRow: false,
      isEndingRow: true,
      startColumn: startingRow.text.length,
      endColumn: startingRow.text.length,
      node: startingRow.node!,
      index: startingRow.index,
      focusColumn: startingRow.text.length,
    };
  }

  // If selected the focus is on the starting row and the User pressed 'Enter''
  return {
    selected: true,
    key: startingRow.key,
    text: `${startingRow.text.substring(0, startingRow.startColumn!)}${endingRow.text.substring(
      endingRow.endColumn!,
      endingRow.text.length,
    )}`,
    isStartingRow: true,
    isMiddleRow: false,
    isEndingRow: true,
    startColumn: startingRow.startColumn!,
    endColumn: startingRow.startColumn!,
    node: startingRow.node!,
    index: startingRow.index,
    focusColumn: 0,
  };
};

export const removeRow = (rowToDelete: RowWithSelectedInfo[], row: Row) => {
  const precedingRow = rowToDelete[row.index - 1];
  precedingRow.focusColumn = precedingRow.text.length;

  rowToDelete.splice(row.index, 1);

  return rowToDelete;
};

export const deleteCharFromRow = (
  rows: RowWithSelectedInfo[],
  row: RowWithSelectedInfo,
  invertedDirection?: boolean,
) => {
  const caretIsAtTheStartOfTheRow = row.startColumn === 0;
  const caretIsAtTheEndOfTheRow = row.startColumn === row.text.length;

  const previousRow = rows[row.index - 1];
  const nextRow = rows[row.index + 1];

  // If there is only one row, and it's already empty, we can't delete
  if (rows.length === 1 && !row.text.length) {
    rows[row.index].focusColumn = 0;
    return rows;
  }

  // If the user pressed Cancel button, the caret is at the end of the row, and we have not a next row
  // set the caret to the end of the line and return
  if (invertedDirection && caretIsAtTheEndOfTheRow && !nextRow) {
    rows[row.index].focusColumn = row.text.length;
    return rows;
  }

  if (invertedDirection) {
    // If the caret is at the end of the line, we have to merge row with the next one
    if (caretIsAtTheEndOfTheRow) {
      // Keep all rows except focused and next, because we will merge them
      const rowsToKeep = rows.removeItems((x) => [row, nextRow].includes(x));

      return [...rowsToKeep, mergeRows(row, nextRow)];
    }

    row.text = row.text.removeChars(row.startColumn!, row.startColumn! + 1);
    row.focusColumn = row.startColumn!;
  } else {
    // If the caret is at the start of the line, we have to merge row with the previous one
    if (caretIsAtTheStartOfTheRow) {
      // Keep all rows except focused and previous, because we will merge them
      const rowsToKeep = rows.removeItems((x) => [row, previousRow].includes(x));

      return [...rowsToKeep, mergeRows(previousRow, row)];
    }

    row.text = row.text.removeChars(row.startColumn! - 1, row.startColumn!);
    row.focusColumn = row.startColumn! - 1;
  }

  rows[row.index] = row;
  return rows;
};

export const unfocusAllRows = (rows: Row[]): Row[] => {
  return rows.map((row) => ({ ...row, focusColumn: undefined }));
};

export const removeMiddleRows = (rows: RowWithSelectedInfo[]) => {
  return rows.removeItems((row) => row.selected && row.isMiddleRow);
};
