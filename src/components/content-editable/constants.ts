import { onEnterPress } from '@/components/content-editable/keyDownActions';
import { KEY_ACTION_MAP_TYPE } from '@/components/content-editable/types';

export const KEY_ACTION_MAP: KEY_ACTION_MAP_TYPE = {
  Enter: {
    action: onEnterPress,
    preventDefault: true,
  },
};
