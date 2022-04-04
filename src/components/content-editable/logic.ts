import { KeyMap, RowSelections } from '@/components/content-editable/types';
import { KEY_ACTION_MAP } from '@/components/content-editable/constants';
import React from 'react';

// TODO Check if it is possible to replace this logic with with closest() function
const getRowElementKey = (htmlNode: Node): string => {
  if (!htmlNode.parentElement) throw Error('No parent element');

  if (htmlNode.parentElement.hasAttribute('data-key'))
    return htmlNode.parentElement.getAttribute('data-key')!;

  return getRowElementKey(htmlNode.parentElement);
};

const shouldPreventDefault = ({ preventDefault }: KeyMap, ctrlKey: boolean, shiftKey: boolean) => {
  return typeof preventDefault === 'boolean' ? preventDefault : preventDefault(ctrlKey, shiftKey);
};

export const handleInput = (
  e: React.KeyboardEvent<HTMLDivElement>,
  currentState: RowSelections,
) => {
  if (!(e.key in KEY_ACTION_MAP)) return;

  const keyMap = KEY_ACTION_MAP[e.key];
  const { ctrlKey, shiftKey } = e;

  if (shouldPreventDefault(keyMap, ctrlKey, shiftKey)) e.preventDefault();

  const selection = getSelection(currentState);

  const htmlActionResult = keyMap.action(ctrlKey, shiftKey);
};

const getSelection = (currentState: RowSelections) => {
  const selection = window.getSelection();
  if (!selection || !selection.focusNode) return null;

  if (selection.type === 'Caret') {
    return getCaretSelection(selection);
  }

  return getRangeSelection(selection, currentState);
};

const getCaretSelection = (selection: Selection): RowSelections => {
  const rowElementKey = getRowElementKey(selection.focusNode!);

  return {
    [rowElementKey]: {
      node: selection.focusNode!,
      isStartingRow: true,
      isMiddleRow: false,
      isEndingRow: true,
      startColumn: selection.focusOffset,
      endColumn: selection.anchorOffset,
    },
  };
};

const getRangeSelection = (selection: Selection, currentState: RowSelections): RowSelections => {
  const isOnlyOneRow = selection.focusNode === selection.anchorNode;

  if (isOnlyOneRow) {
    return {
      [getRowElementKey(selection.focusNode!)]: {
        node: selection.focusNode!,
        isStartingRow: true,
        isMiddleRow: false,
        isEndingRow: true,
        startColumn: selection.focusOffset,
        endColumn: selection.anchorOffset,
      },
    };
  }

  return Object.keys(currentState).reduce((acc, curr) => {
    const row = currentState[curr];

    if (selection.containsNode(row.node, true)) {
      const isStartingRow = selection.focusNode === row.node;
      const isEndingRow = selection.anchorNode === row.node;
      acc[curr] = {
        ...row,
        isStartingRow,
        isEndingRow,
        isMiddleRow: !isStartingRow && !isEndingRow,
      };
    }

    return acc;
  }, {} as RowSelections);
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
