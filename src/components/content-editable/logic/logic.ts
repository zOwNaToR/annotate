import { Row, SelectedRow, SelectionType } from '@/components/content-editable/types';
import React from 'react';
import { getSelection, shouldDeleteSelection } from '@/components/content-editable/logic/selection.logic';

// const shouldPreventDefault = ({ preventDefault }: KeyMap, ctrlKey: boolean, shiftKey: boolean) => {
//   return typeof preventDefault === 'boolean' ? preventDefault : preventDefault(ctrlKey, shiftKey);
// };

export const onInputLogic = (e: React.KeyboardEvent<HTMLDivElement>, currentRows: Row[]) => {
  e.preventDefault();

  const rows = unfocusAllRows(currentRows);
  const selection = getSelection(currentRows);

  if (shouldDeleteSelection(selection)) {
    deleteSelection(rows, selection, e.key === 'Delete');
  }

  const focusedColumn = getRowByKey(rows, selection.selectedRows[0].key)!;
  // @ts-ignore
  focusedColumn.text = addTextToRow(focusedColumn, e.data, selection.selectedRows[0].startColumn);
  // @ts-ignore
  focusedColumn.focusColumn = selection.selectedRows[0].startColumn + e.data.length;

  // if (!(e.key in KEY_ACTION_MAP)) return rows;
  //
  // const keyMap = KEY_ACTION_MAP[e.key];
  // const { ctrlKey, shiftKey } = e;
  //
  // if (shouldPreventDefault(keyMap, ctrlKey, shiftKey)) e.preventDefault();
  //
  // const htmlActionResult = keyMap.action(ctrlKey, shiftKey);

  return rows;
};

const unfocusAllRows = (rows: Row[]): Row[] => {
  return rows.map((row) => ({ ...row, focusColumn: undefined }));
};

const getRowByKey = (rows: Row[], key: string) => {
  return rows.find((x) => x.key === key);
};

const addTextToRow = (row: Row, text: string, position: number) => {
  return row.text.slice(0, position) + text + row.text.slice(position);
};

export const deleteSelection = (rows: Row[], selection: SelectionType, deleteFromEnd: boolean) => {
  const { type, selectedRows } = selection;

  if (type === 'Caret') {
    const selectedRow = selectedRows[0];
    const row = getRowByKey(rows, selectedRow.key)!;

    if (deleteFromEnd) {
      row.text = removeCharsFromString(row.text, selectedRow.startColumn - 1, selectedRow.startColumn);
    } else {
      row.text = removeCharsFromString(row.text, selectedRow.startColumn, selectedRow.startColumn + 1);
    }
  } else {
    removeFullySelectedRows(rows, selectedRows);

    removeSelectedTextFromPartiallySelectedRows(rows, selectedRows);
  }
};

const removeFullySelectedRows = (rows: Row[], selectedRows: SelectedRow[]) => {
  return rows.filter((row) => {
    const selectedRow = selectedRows.find((x) => x.key === row.key);

    return !selectedRow?.isMiddleRow || selectedRow.text.length === selectedRow.startColumn + selectedRow.endColumn;
  });
};

const removeSelectedTextFromPartiallySelectedRows = (rows: Row[], selectedRows: SelectedRow[]) => {
  rows.map((row) => {
    const selectedRow = selectedRows.find((x) => x.key === row.key);
    if (!selectedRow) return row;

    row.text = removeCharsFromString(row.text, selectedRow.startColumn, selectedRow.endColumn);
    return row;
  });
};

const removeCharsFromString = (str: string, start: number, end: number) => {
  return str.slice(0, start) + str.slice(end);
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
