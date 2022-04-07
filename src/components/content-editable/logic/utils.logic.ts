import { KeyMap, Row, SelectedRow } from '@/components/content-editable/types';
import { removeSpacesFromString } from '@/utils/utils';

export const shouldPreventDefault = ({ preventDefault }: KeyMap, ctrlKey: boolean, shiftKey: boolean) => {
  return typeof preventDefault === 'boolean' ? preventDefault : preventDefault(ctrlKey, shiftKey);
};

export const getRowByKey = (rows: Row[], key: string) => {
  return rows.find((x) => x.key === key);
};

export const isFullySelectedRow = (selectedRow: SelectedRow) => {
  return (
    selectedRow.isMiddleRow ||
    removeSpacesFromString(selectedRow.text).length === selectedRow.startColumn + selectedRow.endColumn
  );
};

export const addTextToRow = (focusedRow: Row, text: string, position: number) => {
  return focusedRow.text.slice(0, position) + text + focusedRow.text.slice(position);
};
