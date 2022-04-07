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

type RowSelectedInfo =
  | {
      selected: false;
      node?: never;
      isStartingRow?: never;
      isMiddleRow?: never;
      isEndingRow?: never;
      startColumn?: never;
      endColumn?: never;
    }
  | {
      selected: true;
      node: Node;
      isStartingRow: boolean;
      isMiddleRow: boolean;
      isEndingRow: boolean;
      startColumn: number;
      endColumn: number;
    };

export type RowWithSelectedInfo = Row & RowSelectedInfo;

export type PartialRowWithSelectedInfo = PartialBy<RowWithSelectedInfo, 'startColumn' | 'endColumn'>;
