export interface ICaretPosition {
  row: number;
  column: number;
}

// KeyDown
export type KeyAction = (ctrlKey: boolean, shiftKey: boolean) => HTMLElement | string | void;
export type KeyMap = {
  action: KeyAction;
  preventDefault: boolean | ((ctrlKey: boolean, shiftKey: boolean) => boolean);
};

export type KEY_ACTION_MAP_TYPE = {
  [key: string]: KeyMap;
};

export type RowSelections = {
  [key: string]: {
    node: Node;
    isStartingRow: boolean;
    isMiddleRow: boolean;
    isEndingRow: boolean;
    startColumn: number;
    endColumn: number;
  };
};
