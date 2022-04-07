import { removeFullySelectedRows } from '@/components/content-editable/logic/selection.logic';
import { RowWithSelectedInfo } from '@/components/content-editable/types';

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

    expect(removeFullySelectedRows(rows)).toEqual(rows);
  });

  it('Should remove nothing when the second row is not fully selected', () => {
    const rows: RowWithSelectedInfo[] = [
      {
        selected: true,
        node: {} as unknown as Node,
        key: '1',
        text: 'Hi',
        isStartingRow: true,
        isEndingRow: false,
        isMiddleRow: false,
        startColumn: 0,
        endColumn: 2,
      },
      {
        selected: true,
        node: {} as unknown as Node,
        key: '2',
        text: 'You',
        isStartingRow: false,
        isEndingRow: true,
        isMiddleRow: false,
        startColumn: 0,
        endColumn: 2,
      },
    ];

    expect(removeFullySelectedRows(rows)).toEqual(rows);
  });
});
