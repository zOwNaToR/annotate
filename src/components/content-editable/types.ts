import { PartialBy } from '@/utils/types';

// KeyDown
export type KeyAction = (ctrlKey: boolean, shiftKey: boolean) => HTMLElement | string | void;
export type KeyMap = {
  action: KeyAction;
  preventDefault: boolean | ((ctrlKey: boolean, shiftKey: boolean) => boolean);
};

export type KEY_ACTION_MAP_TYPE = {
  [key: string]: KeyMap;
};

export type Row = {
  key: string;
  text: string;
  focusColumn?: number;
};

export type SelectedRow = Row & {
  node: Node;
  isStartingRow: boolean;
  isMiddleRow: boolean;
  isEndingRow: boolean;
  startColumn: number;
  endColumn: number;
};
export type PartialSelectedRow = PartialBy<SelectedRow, 'startColumn' | 'endColumn'>;

export type SelectionType = {
  type: string;
  selectedRows: SelectedRow[];
};
