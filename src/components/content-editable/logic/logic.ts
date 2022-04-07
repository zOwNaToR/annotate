import React from 'react';
import { Row, SelectionType } from '@/components/content-editable/types';
import {
  deleteSelection,
  getSelection,
  shouldDeleteSelection,
} from '@/components/content-editable/logic/selection.logic';
import { ENTER_INPUT_EVENT_DATA, KEY_ACTION_MAP } from '@/components/content-editable/constants';
import { generateRandomId, removeCharsFromString } from '@/utils/utils';
import { addTextToRow, getRowByKey, shouldPreventDefault } from '@/components/content-editable/logic/utils.logic';

// Entrypoint - Functions for handling events
export const onInputLogic = (e: React.KeyboardEvent<HTMLDivElement>, currentRows: Row[]) => {
  e.preventDefault();

  // @ts-ignore
  const data: string = e.data;

  let rows = unfocusAllRows(currentRows);
  const selection = getSelection(currentRows);

  if (shouldDeleteSelection(selection)) {
    rows = deleteSelection(rows, selection, e.key === 'Delete');
  }

  if (data === ENTER_INPUT_EVENT_DATA) {
    addNewRowWithFocus(rows, selection);
  } else {
    setFocusAndTextToSelectedColumn(rows, selection, data);
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
const addNewRowWithFocus = (rows: Row[], selection: SelectionType) => {
  const selectedRow = selection.selectedRows[0];
  const focusedRow = getRowByKey(rows, selectedRow.key)!;
  const focusedRowIndex = rows.indexOf(focusedRow);

  const newRow = {
    key: generateRandomId(5),
    text: focusedRow.text.slice(selectedRow.startColumn, focusedRow.text.length) || '\n',
    focusColumn: 0,
  };

  focusedRow.text = removeCharsFromString(focusedRow.text, selectedRow.startColumn, focusedRow.text.length);

  rows.splice(focusedRowIndex + 1, 0, newRow);
};

const setFocusAndTextToSelectedColumn = (rows: Row[], selection: SelectionType, text: string) => {
  const selectedRow = selection.selectedRows[0];
  const focusedRow = getRowByKey(rows, selectedRow.key)!;

  focusedRow.text = addTextToRow(focusedRow, text, selectedRow.startColumn);
  focusedRow.focusColumn = selectedRow.startColumn + text.length;
};

const unfocusAllRows = (rows: Row[]): Row[] => {
  return rows.map((row) => ({ ...row, focusColumn: undefined }));
};
