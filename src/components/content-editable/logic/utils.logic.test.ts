import { removeFullySelectedRows } from '@/components/content-editable/logic/utils.logic';
import { Row, SelectedRow, SelectionType } from '@/components/content-editable/types';

describe('removeFullySelectedRows', () => {
  it('Should remove nothing with only one row', () => {
    const myRows: Row[] = [
      {
        key: '1',
        text: 'Hi',
      },
    ];

    const selectedRows: SelectedRow[] = [
      {
        node: {} as unknown as Node,
        key: '1',
        text: 'Hi',
        isStartingRow: true,
        isEndingRow: true,
        isMiddleRow: false,
        startColumn: 0,
        endColumn: 1,
      },
    ];

    expect(removeFullySelectedRows(myRows, selectedRows)).toEqual(myRows);
  });

  it('Should remove nothing when the second row is not fully selected', () => {
    const myRows: Row[] = [
      {
        key: '1',
        text: 'Hi',
      },
      {
        key: '2',
        text: 'You',
      },
    ];

    const selectedRows: SelectedRow[] = [
      {
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

    expect(removeFullySelectedRows(myRows, selectedRows)).toEqual(myRows);
  });
});
