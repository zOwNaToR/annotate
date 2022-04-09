import { PartialBy } from '@/utils/types';

// KeyDown
export type KeyAction = (currentRows: Row[], ctrlKey: boolean, shiftKey: boolean) => RowWithSelectedInfo[];
export type KeyMap = {
  action: KeyAction;
  preventDefault: boolean | ((ctrlKey: boolean, shiftKey: boolean) => boolean);
};

export type KEY_ACTION_MAP_TYPE = {
  [key: string]: KeyMap;
};

// Rows
export type Row = {
  key: string;
  text: string;
  focusColumn?: number;
};

export type StartEndColumns<T extends number | never> = {
  startColumn: number;
  endColumn: number;
};

type RowSelectedInfo =
  | (Partial<StartEndColumns<never>> & {
      selected: false;
      node?: never;
      isStartingRow?: never;
      isMiddleRow?: never;
      isEndingRow?: never;
    })
  | (StartEndColumns<number> & {
      selected: true;
      node: Node;
      isStartingRow: boolean;
      isMiddleRow: boolean;
      isEndingRow: boolean;
    });

export type RowWithSelectedInfo = Row & RowSelectedInfo;
export type PartialRowWithSelectedInfo = PartialBy<RowWithSelectedInfo, 'startColumn' | 'endColumn'>;
