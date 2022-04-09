import { RowWithSelectedInfo } from '@/components/content-editable/types';
import { removeMiddleRows } from '@/components/content-editable/logic/main/logic';

describe('removeFullySelectedRows', () => {
  it('Should remove nothing with only one row', () => {
    const rows: RowWithSelectedInfo[] = [
      {
        key: '1',
        text: 'Hi',
        selected: true,
        node: {} as unknown as Node,
        isStartingRow: true,
        isEndingRow: true,
        isMiddleRow: false,
        startColumn: 0,
        endColumn: 1,
      },
    ];

    expect(removeMiddleRows(rows)).toEqual(rows);
  });

  it('Should remove nothing when the second row is not fully selected', () => {
    const rows: RowWithSelectedInfo[] = [
      {
        key: '1',
        text: 'Hi',
        selected: true,
        node: {} as unknown as Node,
        isStartingRow: true,
        isEndingRow: false,
        isMiddleRow: false,
        startColumn: 0,
        endColumn: 2,
      },
      {
        key: '2',
        text: 'You',
        selected: true,
        node: {} as unknown as Node,
        isStartingRow: false,
        isEndingRow: true,
        isMiddleRow: false,
        startColumn: 0,
        endColumn: 2,
      },
    ];

    expect(removeMiddleRows(rows)).toEqual(rows);
  });
});
