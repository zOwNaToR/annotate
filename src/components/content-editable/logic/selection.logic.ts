import {
  PartialRowWithSelectedInfo,
  Row,
  RowWithSelectedInfo,
  SelectedRow,
  SelectionType,
} from '@/components/content-editable/types';
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

export const shouldDeleteSelectionNew = (rows: RowWithSelectedInfo[]) => {
  const startingRow = rows.find((x) => x.selected && x.isStartingRow)!;

  return getSelectionNew().type === 'Range' || startingRow.startColumn! < startingRow.endColumn!;
};

export const getSelectionNew = (): Selection => {
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

/*






 */

export const getSelection = (currentRows: Row[]): SelectionType => {
  const selection = window.getSelection()!;

  const onlyOneRowSelected = selection.focusNode === selection.anchorNode;

  if (selection.type === 'Caret' || onlyOneRowSelected) {
    const rowElement = getDomClosestRowElement(selection.focusNode!);

    return {
      type: selection.type,
      selectedRows: [
        {
          key: rowElement.getAttribute('data-key')!,
          node: rowElement,
          text: rowElement.innerText,
          isStartingRow: true,
          isMiddleRow: false,
          isEndingRow: true,
          startColumn: selection.focusOffset,
          endColumn: selection.anchorOffset,
        },
      ],
    };
  }

  const selectedRows = currentRows.reduce((acc, curr) => {
    const row = getDomRowElementByKey(curr.key)!;

    if (selection.containsNode(row, true)) {
      const isStartingRow = row.contains(selection.focusNode);
      const isEndingRow = row.contains(selection.anchorNode);

      const rowInfo: PartialRowWithSelectedInfo = {
        node: row,
        key: row.getAttribute('data-key')!,
        text: row.innerText,
        isStartingRow,
        isEndingRow,
        isMiddleRow: !isStartingRow && !isEndingRow,
      };

      return [...acc, { ...setRowStartEndColumns(rowInfo, selection) }];
    }

    return acc;
  }, [] as SelectedRow[]);

  return {
    type: selection.type,
    selectedRows,
  };
};

export const shouldDeleteSelection = ({ type, selectedRows }: SelectionType) => {
  return type === 'Range' || selectedRows[0].startColumn < selectedRows[0].endColumn;
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
