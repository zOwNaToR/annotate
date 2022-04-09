import {
  PartialRowWithSelectedInfo,
  Row,
  RowWithSelectedInfo,
  StartEndColumns,
} from '@/components/content-editable/types';
import { getDomClosestRowElement, getDomRowElementByKey } from '@/components/content-editable/logic/dom.logic';
import { orderRows } from '@/components/content-editable/logic/utils.logic';
import { mergeRows, removeMiddleRows } from '@/components/content-editable/logic/logic';

export const markSelectedRows = (rows: Row[]): RowWithSelectedInfo[] => {
  const selection = window.getSelection()!;

  const onlyOneRowSelected = selection.focusNode === selection.anchorNode;

  if (selection.type === 'Caret' || onlyOneRowSelected) {
    const selectedElement = getDomClosestRowElement(selection.focusNode!);
    const selectedElementKey = selectedElement.getAttribute('data-key')!;

    return rows.map((row) => {
      if (row.key !== selectedElementKey) return { ...row, selected: false };

      return {
        ...row,
        selected: true,
        node: selectedElement,
        isStartingRow: true,
        isMiddleRow: false,
        isEndingRow: true,
        startColumn: selection.focusOffset,
        endColumn: selection.anchorOffset,
      };
    });
  }

  return rows.map((row) => {
    const domRow = getDomRowElementByKey(row.key)!;

    if (!selection.containsNode(domRow, true)) {
      return { ...row, selected: false };
    }

    const isStartingRow = domRow.contains(selection.focusNode);
    const isEndingRow = domRow.contains(selection.anchorNode);

    const rowInfo: PartialRowWithSelectedInfo = {
      ...row,
      selected: true,
      node: domRow,
      isStartingRow,
      isEndingRow,
      isMiddleRow: !isStartingRow && !isEndingRow,
    };

    return { ...rowInfo, ...getRowStartEndColumns(rowInfo, selection) } as RowWithSelectedInfo;
  });
};

export const shouldDeleteSelectedRows = (rows: RowWithSelectedInfo[]) => {
  const firstSelectedRow = getFirstSelectedRow(rows)!;

  return getSelection().type === 'Range' || firstSelectedRow.startColumn! < firstSelectedRow.endColumn!;
};

export const getSelection = (): Selection => {
  return window.getSelection()!;
};

const getRowStartEndColumns = (row: PartialRowWithSelectedInfo, selection: Selection): StartEndColumns<number> => {
  if (row.isStartingRow) {
    return {
      startColumn: selection.focusOffset,
      endColumn: row.node!.textContent?.length ?? 0,
    };
  }

  if (row.isEndingRow) {
    return {
      startColumn: 0,
      endColumn: selection.anchorOffset,
    };
  }

  return {
    startColumn: 0,
    endColumn: row.node!.textContent?.length ?? 0,
  };
};

export const setNewCaretPosition = (rowToFocus: HTMLElement, column: number) => {
  const range = document.createRange();
  const selection = window.getSelection()!;

  if (!rowToFocus.childNodes.length) {
    const emptyTextNode = document.createTextNode('');
    rowToFocus.appendChild(emptyTextNode);
  }

  range.setStart(rowToFocus.childNodes[0], column);
  range.collapse(true);

  selection.removeAllRanges();
  selection.addRange(range);
};

export const getFirstSelectedRow = (rows: RowWithSelectedInfo[]) => {
  return rows.find((row) => row.selected && row.isStartingRow);
};

export const deleteSelectedRows = (rows: RowWithSelectedInfo[]): RowWithSelectedInfo[] => {
  // if (type === 'Caret') {
  //   const selectedRow = selectedRows[0];
  //   const row = getRowByKey(rows, selectedRow.key)!;
  //
  //   if (deleteFromEnd) {
  //     row.text = removeCharsFromString(row.text, selectedRow.startColumn - 1, selectedRow.startColumn);
  //   } else {
  //     row.text = removeCharsFromString(row.text, selectedRow.startColumn, selectedRow.startColumn + 1);
  //   }
  //
  //   return rows;
  // }

  rows = removeMiddleRows(rows);

  const selectedRows = rows.filter((x) => x.selected);
  const unSelectedRows = rows.filter((x) => !x.selected);

  if (selectedRows.length === 1) {
    return orderRows([...unSelectedRows, ...removeSelectedTextFromRows(rows)]);
  } else {
    return orderRows([...unSelectedRows, mergeRows(selectedRows[0], selectedRows[1])]);
  }
};

export const removeSelectedTextFromRows = (rows: RowWithSelectedInfo[]) => {
  return rows.map((row) => {
    if (!row.selected) return row;

    row.text = row.text.removeChars(row.startColumn, row.endColumn);
    return row;
  });
};
