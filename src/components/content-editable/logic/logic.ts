import React from 'react';
import { Row } from '@/components/content-editable/types';
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
export const onInputLogic = (e: React.KeyboardEvent<HTMLDivElement>, currentRows: Row[]) => {
  e.preventDefault();

  // @ts-ignore
  const data: string = e.data;

  let rows = unfocusAllRows(currentRows);
  // const selection = getSelection(currentRows);
  const rowsWithSelection = markSelectedRows(rows);

  if (shouldDeleteSelectedRows(rowsWithSelection)) {
    rows = deleteSelectedRows(rowsWithSelection);
  }

  // After deleting selected rows, we need to get the first selected row because now it's the focused row
  const firstSelectedRow = getFirstSelectedRow(rowsWithSelection)!;

  if (data === ENTER_INPUT_EVENT_DATA) {
    rows = addNewRow(
      rows,
      rows.findIndex((x) => x.key === firstSelectedRow.key),
      firstSelectedRow.endColumn!,
    );
  } else {
    const editingRow: Row = getRowByKey(rows, firstSelectedRow.key)!;

    editingRow.text = addTextToRow(editingRow, data, firstSelectedRow.startColumn!);
    editingRow.focusColumn = firstSelectedRow.startColumn! + data.length;
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

  // Create new row with text copied from sourceRow, from insertAtColumn to the end of the row.
  // At index sourceRow + 1
  const newRow: Row = {
    key: generateRandomId(5),
    text: sourceRow.text.slice(insertAtColumn, sourceRow.text.length) || '\n',
    focusColumn: 0,
    index: insertAtRow + 1,
  };

  // Remove text after insertAtColumn
  sourceRow.text = removeCharsFromString(sourceRow.text, insertAtColumn, sourceRow.text.length);

  rows.splice(newRow.index, 0, newRow);
  return rows;
};

const unfocusAllRows = (rows: Row[]): Row[] => {
  return rows.map((row) => ({ ...row, focusColumn: undefined }));
};
