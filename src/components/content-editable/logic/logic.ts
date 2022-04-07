import React from 'react';
import { Row } from '@/components/content-editable/types';
import {
  getFirstSelectedRow,
  markSelectedRows,
  shouldDeleteSelectedRows,
} from '@/components/content-editable/logic/selection.logic';
import { ENTER_INPUT_EVENT_DATA, KEY_ACTION_MAP } from '@/components/content-editable/constants';
import { generateRandomId, removeCharsFromString } from '@/utils/utils';
import {
  addTextToRow,
  deleteSelectedRows,
  shouldPreventDefault,
} from '@/components/content-editable/logic/utils.logic';

// Entrypoint - Functions for handling events
export const onInputLogic = (e: React.KeyboardEvent<HTMLDivElement>, currentRows: Row[]) => {
  e.preventDefault();

  // @ts-ignore
  const data: string = e.data;

  let rows = unfocusAllRows(currentRows);
  // const selection = getSelection(currentRows);
  const rowsWithSelection = markSelectedRows(currentRows);

  if (shouldDeleteSelectedRows(rowsWithSelection)) {
    rows = deleteSelectedRows(rowsWithSelection, e.key === 'Delete');
  }

  // After deleting selected rows, we need to get the first selected row because now it's the focused row
  const firstSelectedRow = getFirstSelectedRow(rowsWithSelection)!;

  if (data === ENTER_INPUT_EVENT_DATA) {
    rows = addNewRow(rows, rows.indexOf(firstSelectedRow), firstSelectedRow.endColumn!);
  } else {
    firstSelectedRow.text = addTextToRow(firstSelectedRow, data, firstSelectedRow.startColumn!);
    firstSelectedRow.focusColumn = firstSelectedRow.startColumn! + data.length;
  }

  return rows;
};

export const onShortcutLogic = (e: React.KeyboardEvent<HTMLDivElement>, currentRows: Row[]) => {
  if (!(e.key in KEY_ACTION_MAP)) return currentRows;

  const keyMap = KEY_ACTION_MAP[e.key];
  const { ctrlKey, shiftKey } = e;

  if (shouldPreventDefault(keyMap, ctrlKey, shiftKey)) e.preventDefault();

  keyMap.action(ctrlKey, shiftKey);
};

// Helper functions
const addNewRow = (rows: Row[], insertAtRow: number, insertAtColumn: number) => {
  const sourceRow = rows[insertAtRow];

  // Create new row with text copied from sourceRow. From insertAtColumn to the end of the row
  const newRow = {
    key: generateRandomId(5),
    text: sourceRow.text.slice(insertAtColumn, sourceRow.text.length) || '\n',
    focusColumn: 0,
  };

  // Remove text after insertAtColumn
  sourceRow.text = removeCharsFromString(sourceRow.text, insertAtColumn, sourceRow.text.length);

  // Insert new row at startingRowIndex + 1
  rows.splice(insertAtRow + 1, 0, newRow);
  return rows;
};

const unfocusAllRows = (rows: Row[]): Row[] => {
  return rows.map((row) => ({ ...row, focusColumn: undefined }));
};
