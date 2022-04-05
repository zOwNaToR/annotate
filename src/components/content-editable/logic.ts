import {
  KeyMap,
  PartialRowSelection,
  Row,
  RowSelections,
} from '@/components/content-editable/types';
import { KEY_ACTION_MAP } from '@/components/content-editable/constants';
import React from 'react';

const getRowElementByKey = (key: string): HTMLElement | null => {
  return document.querySelector(`div[data-key='${key}']`);
};
// TODO Check if it is possible to replace this logic with with closest() function
const getClosestRowElement = (htmlNode: Node): HTMLElement => {
  if (!htmlNode.parentElement) return document.querySelector('div[data-key]')!;

  if (htmlNode.parentElement.hasAttribute('data-key')) return htmlNode.parentElement!;

  return getClosestRowElement(htmlNode.parentElement);
};

const shouldPreventDefault = ({ preventDefault }: KeyMap, ctrlKey: boolean, shiftKey: boolean) => {
  return typeof preventDefault === 'boolean' ? preventDefault : preventDefault(ctrlKey, shiftKey);
};

export const onInputLogic = (e: React.KeyboardEvent<HTMLDivElement>, currentRows: Row[]) => {
  const selectedRows = getSelectedRows(currentRows);
  // TODO Remove selectedRows

  const newRows = [...currentRows];
  // @ts-ignore
  newRows.find((x) => x.key === Object.keys(selectedRows)[0])!.text += e.data;
  e.preventDefault();

  if (!(e.key in KEY_ACTION_MAP)) return newRows;

  const keyMap = KEY_ACTION_MAP[e.key];
  const { ctrlKey, shiftKey } = e;

  // if (shouldPreventDefault(keyMap, ctrlKey, shiftKey)) e.preventDefault();

  const htmlActionResult = keyMap.action(ctrlKey, shiftKey);

  return newRows;
};

const getSelectedRows = (currentRows: Row[]): RowSelections => {
  const selection = window.getSelection()!;

  const isOnlyOneRow = selection.focusNode === selection.anchorNode;

  if (selection.type === 'Caret' || isOnlyOneRow) {
    const rowElement = getClosestRowElement(selection.focusNode!);
    return {
      [rowElement.getAttribute('data-key')!]: {
        node: rowElement!,
        isStartingRow: true,
        isMiddleRow: false,
        isEndingRow: true,
        startColumn: selection.focusOffset,
        endColumn: selection.anchorOffset,
      },
    };
  }

  return currentRows.reduce((acc, curr) => {
    const row = getRowElementByKey(curr.key);

    if (!row) return acc;

    if (selection.containsNode(row)) {
      const isStartingRow = selection.focusNode === row;
      const isEndingRow = selection.anchorNode === row;

      const rowInfo: PartialRowSelection = {
        node: row,
        isStartingRow,
        isEndingRow,
        isMiddleRow: !isStartingRow && !isEndingRow,
      };

      return {
        ...acc,
        [curr.key]: {
          ...fillPartialRow(rowInfo, selection),
        },
      };
    }

    return acc;
  }, {} as RowSelections);
};

const fillPartialRow = (row: PartialRowSelection, selection: Selection) => {
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

/*

Per le shortcut come CTRL+B bisogna usare onKeyPress per sapere quale pulsante è stato premuto e avere informazioni su ctrlKey e shiftKey
Per i caratteri normali onBeforeInput

Prendo la selection
Se è type Range mi ciclo tutti i miei elementi per trovare il focuseNode,
  una volta trovato,
   se è anche anchorNode, significa che sto selezionado solo una riga e calcolo tramite focusOffset e anchorOffset, la posizione iniziale e finale del testo selezionato
   altrimenti setto come testo selezionato da focusOffset fino a fine riga,

  per i prossimi cicli
    se è anchorNode setto come testo selezionato da inizio riga fino a anchorOffset,
    altrimenti seleziono tuta la riga

Se ho del testo selezionato e ho un comando che modifica il testo
  ciclo le righe selezionate,
    se è focusNode cancello il testo da focusOffest fino a fine riga,
    altrimenti significa che ho più righe, quindi
      se è anchorNode cancello il testo da inizio riga fino a anchorOffset e mergio il rimanente in focusNode
      altrimenti cancello tutta la riga


  Tab => Inserisco \n e poi faccio uguale al Char/Incolla
  Char/Incolla => Scrivo il char alla riga del focusNode partendo dal focusOffset
  Enter => Rimuovo tutto il testo da focusNode fino a fine riga e inserisco una nuova riga che contiene il testo appena eliminato
 */
