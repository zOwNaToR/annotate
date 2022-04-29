import { RowWithSelectedInfo } from '@/components/content-editable/types';
import { generateRandomId } from '@/utils/utils';
import { splitText } from '@/components/content-editable/logic/utils/utils';

export const splitRow = (
  sourceRow: RowWithSelectedInfo,
  splitFromColumn: number,
): [RowWithSelectedInfo, RowWithSelectedInfo] => {
  const [sourceRowText, newRowText] = splitText(sourceRow.text, splitFromColumn);
  sourceRow.text = sourceRowText;

  // Create new row with text copied from sourceRow, from "splitFromColumn" to the end of the row.
  const newRow: RowWithSelectedInfo = {
    ...sourceRow,
    key: generateRandomId(5),
    text: newRowText,
  };

  return [sourceRow, newRow];
};

export const mergeRows = (
  mainRow: RowWithSelectedInfo, // MainRow will be focused if focusRow is true
  otherRow: RowWithSelectedInfo,
  keepAllText: boolean,
  focusRow?: boolean,
): RowWithSelectedInfo => {
  let startColumn = mainRow.startColumn!;
  let endColumn = mainRow.endColumn!;
  let focusColumn = focusRow ? 0 : undefined;
  let text = `${mainRow.text.substring(0, mainRow.startColumn!)}${otherRow.text.substring(
    otherRow.endColumn!,
    otherRow.text.length,
  )}`;

  if (keepAllText) {
    startColumn = mainRow.text.length;
    endColumn = mainRow.text.length;
    focusColumn = focusRow ? mainRow.text.length : undefined;
    text = `${mainRow.text}${otherRow.text}`;
  }

  return {
    selected: true,
    key: mainRow.key,
    node: mainRow.node!,
    isStartingRow: true,
    isMiddleRow: false,
    isEndingRow: true,
    startColumn,
    endColumn,
    focusColumn,
    text,
  };
};

export const deleteCharFromRow = (
  rows: RowWithSelectedInfo[],
  row: RowWithSelectedInfo,
  invertedDirection?: boolean,
  focusRowAfterDelete?: boolean,
) => {
  const rowIndex = rows.indexOf(row);

  // If there is only one row, and it's already empty, we can't delete
  if (rows.length === 1 && !row.text.length) {
    if (focusRowAfterDelete) {
      rows[rowIndex].focusColumn = 0;
    }

    return rows;
  }

  const caretIsAtTheStartOfTheRow = row.startColumn === 0;
  const caretIsAtTheEndOfTheRow = row.startColumn === row.text.length;

  const previousRow = rows[rowIndex - 1];
  const nextRow = rows[rowIndex + 1];

  // If the user pressed Cancel button, the caret is at the end of the row, and we have not a next row
  // set the caret to the end of the line and return
  if (invertedDirection && caretIsAtTheEndOfTheRow && !nextRow) {
    if (focusRowAfterDelete) {
      rows[rowIndex].focusColumn = row.text.length;
    }

    return rows;
  }

  // If the caret is at the end of the line, we have to merge row with the next one
  if (invertedDirection && caretIsAtTheEndOfTheRow) {
    rows.splice(rowIndex, 2, mergeRows(row, nextRow, true, true));
    return rows;
  }

  // If the caret is at the start of the line, we have to merge row with the previous one
  if (!invertedDirection && caretIsAtTheStartOfTheRow) {
    rows.splice(rowIndex - 1, 2, mergeRows(previousRow, row, true, true));
    return rows;
  }

  const removeCharFrom = invertedDirection ? row.startColumn! : row.startColumn! - 1;
  const removeCharTo = invertedDirection ? row.startColumn! + 1 : row.startColumn!;

  row.text = row.text.removeChars(removeCharFrom, removeCharTo);
  if (focusRowAfterDelete) {
    row.focusColumn = removeCharFrom;
  }

  rows[rowIndex] = row;
  return rows;
};

export const unfocusAllRows = (rows: RowWithSelectedInfo[]): RowWithSelectedInfo[] => {
  return rows.map((row) => ({ ...row, focusColumn: undefined }));
};

export const removeMiddleRows = (rows: RowWithSelectedInfo[]) => {
  return rows.removeItems((row) => row.selected && row.isMiddleRow);
};

// export const removeRow = (rowToDelete: RowWithSelectedInfo[], row: Row) => {
//   const precedingRow = rowToDelete[row.index - 1];
//   precedingRow.focusColumn = precedingRow.text.length;
//
//   rowToDelete.splice(row.index, 1);
//
//   return rowToDelete;
// };
