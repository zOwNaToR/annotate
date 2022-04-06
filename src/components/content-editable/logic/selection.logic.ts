import { PartialSelectedRow, Row, SelectedRow, SelectionType } from '@/components/content-editable/types';
import { getDomClosestRowElement, getDomRowElementByKey } from '@/components/content-editable/logic/dom.logic';

const fillPartialRow = (row: PartialSelectedRow, selection: Selection) => {
  if (row.isStartingRow) {
    return {
      ...row,
      startColumn: selection.focusOffset,
      endColumn: row.node.textContent?.length ?? 0,
    };
  }

  if (row.isEndingRow) {
    return {
      ...row,
      startColumn: 0,
      endColumn: selection.anchorOffset,
    };
  }

  return {
    ...row,
    startColumn: 0,
    endColumn: row.node.textContent?.length ?? 0,
  };
};

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

      const rowInfo: PartialSelectedRow = {
        node: row,
        key: row.getAttribute('data-key')!,
        text: row.innerText,
        isStartingRow,
        isEndingRow,
        isMiddleRow: !isStartingRow && !isEndingRow,
      };

      return [...acc, { ...fillPartialRow(rowInfo, selection) }];
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
