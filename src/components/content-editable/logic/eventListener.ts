import React from 'react';
import { Row } from '@/components/content-editable/types';
import { ENTER_INPUT_EVENT_DATA, KEY_ACTION_MAP } from '@/components/content-editable/constants';
import {
  addTextToRow,
  mapRowsWithSelectionToRow,
  shouldPreventDefault,
} from '@/components/content-editable/logic/utils/utils';
import {
  deleteSelectedRows,
  getFirstSelectedRow,
  markSelectedRows,
  shouldDeleteSelectedRows,
} from '@/components/content-editable/logic/selection/selection';
import { addRowAction } from '@/components/content-editable/logic/actions/actions';
import { unfocusAllRows } from '@/components/content-editable/logic/logic';
import { generateRandomId } from '@/utils/utils';

export const onInputLogic = (e: React.KeyboardEvent<HTMLDivElement>, currentRows: Row[]): Row[] => {
  e.preventDefault();

  // @ts-ignore
  const data: string = e.data;

  const rowsWithSelection = markSelectedRows(currentRows);
  let rows = unfocusAllRows(rowsWithSelection);

  if (shouldDeleteSelectedRows(rows)) {
    rows = deleteSelectedRows(rows);
  }

  // After deleting selected rows, we need to get the first selected row because now it's the focused row
  const firstSelectedRow = getFirstSelectedRow(rows)!;
  const firstSelectedRowIndex = rows.indexOf(firstSelectedRow);

  if (data === ENTER_INPUT_EVENT_DATA) {
    rows = addRowAction({
      currentRows: rows,
      rowToAdd: { key: generateRandomId(5), text: '' },
      insertRowAtIndex: firstSelectedRowIndex + 1,
      insertColumnAtIndex: firstSelectedRow.endColumn!,
      shouldFocusNewRow: true,
    });
  } else {
    firstSelectedRow.text = addTextToRow(firstSelectedRow, data, firstSelectedRow.startColumn!);
    firstSelectedRow.focusColumn = firstSelectedRow.startColumn! + data.length;
  }

  return mapRowsWithSelectionToRow(rows);
};

export const onShortcutLogic = (e: React.KeyboardEvent<HTMLDivElement>, currentRows: Row[]): Row[] => {
  if (!(e.key in KEY_ACTION_MAP)) return currentRows;

  const { ctrlKey, shiftKey } = e;
  const keyMap = KEY_ACTION_MAP[e.key];

  if (shouldPreventDefault(keyMap, ctrlKey, shiftKey)) e.preventDefault();

  return mapRowsWithSelectionToRow(keyMap.action(currentRows, ctrlKey, shiftKey));
};
