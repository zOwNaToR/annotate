import { PartialRowWithSelectedInfo, Row, RowWithSelectedInfo } from '@/components/content-editable/types';
import { getDomClosestRowElement, getDomRowElementByKey } from '@/components/content-editable/logic/dom.logic';

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
      const a: RowWithSelectedInfo = { ...row, selected: false };
      return a;
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

const getRowStartEndColumns = (
  row: PartialRowWithSelectedInfo,
  selection: Selection,
): { startColumn: number; endColumn: number } => {
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
