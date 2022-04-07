import React from 'react';
import { Row, RowWithSelectedInfo } from '@/components/content-editable/types';
import {
  deleteSelectedRows,
  getFirstSelectedRow,
  markSelectedRows,
  shouldDeleteSelectedRows,
} from '@/components/content-editable/logic/selection.logic';
import { ENTER_INPUT_EVENT_DATA, KEY_ACTION_MAP } from '@/components/content-editable/constants';
import { generateRandomId, removeCharsFromString } from '@/utils/utils';
import { addTextToRow, getRowByKey, shouldPreventDefault } from '@/components/content-editable/logic/utils.logic';

// Entrypoint - Functions for handling events
export const onInputLogic = (e: React.KeyboardEvent<HTMLDivElement>, currentRows: Row[]): Row[] => {
  e.preventDefault();

  // @ts-ignore
  const data: string = e.data;

  const rows = unfocusAllRows(currentRows);
  // const selection = getSelection(currentRows);
  let rowsWithSelection = markSelectedRows(rows);

  if (shouldDeleteSelectedRows(rowsWithSelection)) {
    rowsWithSelection = deleteSelectedRows(rowsWithSelection);
  }

  // After deleting selected rows, we need to get the first selected row because now it's the focused row
  const firstSelectedRow = getFirstSelectedRow(rowsWithSelection)!;

  if (data === ENTER_INPUT_EVENT_DATA) {
    rowsWithSelection = addNewRow(rowsWithSelection, firstSelectedRow.index, firstSelectedRow.endColumn!);
  } else {
    firstSelectedRow.text = addTextToRow(firstSelectedRow, data, firstSelectedRow.startColumn!);
    firstSelectedRow.focusColumn = firstSelectedRow.startColumn! + data.length;
  }

  return rowsWithSelection.map((x) => ({ key: x.key, index: x.index, text: x.text, focusColumn: x.focusColumn }));
};

export const onShortcutLogic = (e: React.KeyboardEvent<HTMLDivElement>, currentRows: Row[]) => {
  if (!(e.key in KEY_ACTION_MAP)) return currentRows;

  const keyMap = KEY_ACTION_MAP[e.key];
  const { ctrlKey, shiftKey } = e;

  if (shouldPreventDefault(keyMap, ctrlKey, shiftKey)) e.preventDefault();

  keyMap.action(ctrlKey, shiftKey);
};

// Helper functions
const addNewRow = (rows: RowWithSelectedInfo[], insertAtRow: number, insertAtColumn: number) => {
  const sourceRow = rows[insertAtRow];

  // Create new row with text copied from sourceRow, from insertAtColumn to the end of the row.
  // At index sourceRow + 1
  const newRow: RowWithSelectedInfo = {
    ...sourceRow,
    key: generateRandomId(5),
    text: sourceRow.text.slice(insertAtColumn, sourceRow.text.length) || '\n',
    focusColumn: 0,
    index: sourceRow.index + 1,
  };

  // Remove text after insertAtColumn
  sourceRow.text = removeCharsFromString(sourceRow.text, insertAtColumn, sourceRow.text.length);

  rows.splice(newRow.index, 0, newRow);
  return rows;
};

const splitRow = (sourceRow: RowWithSelectedInfo, splitFromColumn: number) => {
  // Create new row with text copied from sourceRow, from "splitFromColumn" to the end of the row.
  const newRow: RowWithSelectedInfo = {
    ...sourceRow,
    key: generateRandomId(5),
    text: sourceRow.text.slice(splitFromColumn, sourceRow.text.length) || '\n',
    focusColumn: 0,
    index: sourceRow.index + 1,
  };

  // Remove text after insertAtColumn
  sourceRow.text = removeCharsFromString(sourceRow.text, splitFromColumn, sourceRow.text.length);

  rows.splice(newRow.index, 0, newRow);
  return rows;
};

const unfocusAllRows = (rows: Row[]): Row[] => {
  return rows.map((row) => ({ ...row, focusColumn: undefined }));
};
