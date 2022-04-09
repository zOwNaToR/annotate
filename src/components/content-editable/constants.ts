import { KEY_ACTION_MAP_TYPE } from '@/components/content-editable/types';
import { handleBackspace, handleDelete } from '@/components/content-editable/logic/keyDownActions';

export const ENTER_INPUT_EVENT_DATA = '\n';
export const BACKSPACE_KEY_DOWN = 'Backspace';
export const DELETE_KEY_DOWN = 'Delete';

export const KEY_ACTION_MAP: KEY_ACTION_MAP_TYPE = {
  [BACKSPACE_KEY_DOWN]: {
    action: handleBackspace,
    preventDefault: true,
  },
  [DELETE_KEY_DOWN]: {
    action: handleDelete,
    preventDefault: true,
  },
};
