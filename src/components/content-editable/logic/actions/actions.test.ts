import {
	addRowAction,
	addTextAction,
	deleteRowAction,
	deleteSelectionAction,
	deleteTextAction,
	pasteRowsAction,
} from '@/components/content-editable/logic/actions/actions';
import { RowToAdd } from '@/components/content-editable/logic/actions/types';
import { RowWithSelectedInfo } from '@/components/content-editable/types';
import { describe } from 'vitest';

describe('addRowAction', () => {
	it('should add an empty row after an empty row', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: '',
				selected: false,
			},
		];
		const rowToAdd: RowToAdd = {
			key: '2',
			text: '',
		};
		const insertRowAtIndex = 1;
		const insertColumnAtIndex = 0;

		const newRows = addRowAction({
			currentRows,
			rowToAdd,
			insertRowAtIndex,
			insertColumnAtIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: '',
				selected: false,
			},
			{
				key: '2',
				text: '',
				selected: false,
			},
		]);
	});

	it('should add an empty row after a row with text', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		];
		const rowToAdd: RowToAdd = {
			key: '2',
			text: '',
		};
		const insertRowAtIndex = 1;
		const insertColumnAtIndex = 2;

		const newRows = addRowAction({
			currentRows,
			rowToAdd,
			insertRowAtIndex,
			insertColumnAtIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
			{
				key: '2',
				text: '',
				selected: false,
			},
		]);
	});

	it('should add a row with text at the end of first row', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		];
		const rowToAdd: RowToAdd = {
			key: '2',
			text: 'you',
		};
		const insertRowAtIndex = 1;
		const insertColumnAtIndex = 2;

		const newRows = addRowAction({
			currentRows,
			rowToAdd,
			insertRowAtIndex,
			insertColumnAtIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
			{
				key: '2',
				text: 'you',
				selected: false,
			},
		]);
	});

	it('should add a row with text at the start of first row', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		];
		const rowToAdd: RowToAdd = {
			key: '2',
			text: 'you',
		};
		const insertRowAtIndex = 1;
		const insertColumnAtIndex = 0;

		const newRows = addRowAction({
			currentRows,
			rowToAdd,
			insertRowAtIndex,
			insertColumnAtIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: '',
				selected: false,
			},
			{
				key: '2',
				text: 'youHi',
				selected: false,
			},
		]);
	});

	it('should add a row with text in the middle of first row', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		];
		const rowToAdd: RowToAdd = {
			key: '2',
			text: 'you',
		};
		const insertRowAtIndex = 1;
		const insertColumnAtIndex = 1;

		const newRows = addRowAction({
			currentRows,
			rowToAdd,
			insertRowAtIndex,
			insertColumnAtIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'H',
				selected: false,
			},
			{
				key: '2',
				text: 'youi',
				selected: false,
			},
		]);
	});

	it('should add an empty row in the middle of first row', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		];
		const rowToAdd: RowToAdd = {
			key: '2',
			text: '',
		};
		const insertRowAtIndex = 1;
		const insertColumnAtIndex = 1;

		const newRows = addRowAction({
			currentRows,
			rowToAdd,
			insertRowAtIndex,
			insertColumnAtIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'H',
				selected: false,
			},
			{
				key: '2',
				text: 'i',
				selected: false,
			},
		]);
	});

	it('should focus newly added row at the beginning when empty', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: '',
				selected: false,
			},
		];
		const rowToAdd: RowToAdd = {
			key: '2',
			text: '',
		};
		const insertRowAtIndex = 1;
		const insertColumnAtIndex = 0;

		const newRows = addRowAction({
			currentRows,
			rowToAdd,
			insertRowAtIndex,
			insertColumnAtIndex,
			shouldFocusNewRow: true,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: '',
				selected: false,
			},
			{
				key: '2',
				text: '',
				selected: false,
				focusColumn: 0,
			},
		]);
	});

	it('should focus newly added row at the end of its text', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		];
		const rowToAdd: RowToAdd = {
			key: '2',
			text: 'you',
		};
		const insertRowAtIndex = 1;
		const insertColumnAtIndex = 1;

		const newRows = addRowAction({
			currentRows,
			rowToAdd,
			insertRowAtIndex,
			insertColumnAtIndex,
			shouldFocusNewRow: true,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'H',
				selected: false,
			},
			{
				key: '2',
				text: 'youi',
				selected: false,
				focusColumn: 3,
			},
		]);
	});
});

describe('deleteRowAction', () => {
	it('should delete empty row', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: '',
				selected: false,
			},
			{
				key: '2',
				text: '',
				selected: false,
			},
		];
		const deleteRowIndex = 1;

		const newRows = deleteRowAction({
			currentRows,
			deleteRowIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: '',
				selected: false,
			},
		]);
	});

	it('should delete row with text', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
			{
				key: '2',
				text: 'you',
				selected: false,
			},
		];
		const deleteRowIndex = 1;

		const newRows = deleteRowAction({
			currentRows,
			deleteRowIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		]);
	});

	it('should focus last column of precedent row after deleting', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
			{
				key: '2',
				text: 'you',
				selected: false,
			},
		];
		const deleteRowIndex = 1;

		const newRows = deleteRowAction({
			currentRows,
			deleteRowIndex,
			shouldFocusPrecedentRow: true,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'Hi',
				selected: false,
				focusColumn: 2,
			},
		]);
	});
});

describe('addTextAction', () => {
	it('should add text to empty row', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: '',
				selected: false,
			},
		];
		const insertText = 'Hi';
		const rowIndex = 0;
		const columnIndex = 0;

		const newRows = addTextAction({
			currentRows,
			insertText,
			rowIndex,
			columnIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		]);
	});

	it('should not add empty text', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		];
		const insertText = '';
		const rowIndex = 0;
		const columnIndex = 1;

		const newRows = addTextAction({
			currentRows,
			insertText,
			rowIndex,
			columnIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		]);
	});

	it('should add text to the start of the row', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		];
		const insertText = 'you';
		const rowIndex = 0;
		const columnIndex = 0;

		const newRows = addTextAction({
			currentRows,
			insertText,
			rowIndex,
			columnIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'youHi',
				selected: false,
			},
		]);
	});

	it('should add text to the end of the row', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		];
		const insertText = 'you';
		const rowIndex = 0;
		const columnIndex = 2;

		const newRows = addTextAction({
			currentRows,
			insertText,
			rowIndex,
			columnIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'Hiyou',
				selected: false,
			},
		]);
	});

	it('should add text in the middle of row with text', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		];
		const insertText = 'you';
		const rowIndex = 0;
		const columnIndex = 1;

		const newRows = addTextAction({
			currentRows,
			insertText,
			rowIndex,
			columnIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'Hyoui',
				selected: false,
			},
		]);
	});

	it('should focus at the end of added text', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		];
		const insertText = 'you';
		const rowIndex = 0;
		const columnIndex = 1;

		const newRows = addTextAction({
			currentRows,
			insertText,
			rowIndex,
			columnIndex,
			shouldFocusAtEndOfAddedText: true,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'Hyoui',
				selected: false,
				focusColumn: 4,
			},
		]);
	});

	it('should focus but not add text', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		];
		const insertText = '';
		const rowIndex = 0;
		const columnIndex = 1;

		const newRows = addTextAction({
			currentRows,
			insertText,
			rowIndex,
			columnIndex,
			shouldFocusAtEndOfAddedText: true,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'Hi',
				selected: false,
				focusColumn: 1,
			},
		]);
	});

	it('should add text to the second row', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
			{
				key: '1',
				text: 'how are ',
				selected: false,
			},
		];
		const insertText = 'you?';
		const rowIndex = 1;
		const columnIndex = 8;

		const newRows = addTextAction({
			currentRows,
			insertText,
			rowIndex,
			columnIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
			{
				key: '1',
				text: 'how are you?',
				selected: false,
			},
		]);
	});
});

describe('deleteTextAction', () => {
	it('should delete text at the beginning', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi, how are you?',
				selected: false,
			},
		];
		const rowIndex = 0;
		const startColumnIndex = 0;
		const endColumnIndex = 4;

		const newRows = deleteTextAction({
			currentRows,
			rowIndex,
			startColumnIndex,
			endColumnIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'how are you?',
				selected: false,
			},
		]);
	});

	it('should delete text at the end', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi, how are you?',
				selected: false,
			},
		];
		const rowIndex = 0;
		const startColumnIndex = 11;
		const endColumnIndex = 16;

		const newRows = deleteTextAction({
			currentRows,
			rowIndex,
			startColumnIndex,
			endColumnIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'Hi, how are',
				selected: false,
			},
		]);
	});

	it('should delete text in the middle', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi, how are you?',
				selected: false,
			},
		];
		const rowIndex = 0;
		const startColumnIndex = 3;
		const endColumnIndex = 7;

		const newRows = deleteTextAction({
			currentRows,
			rowIndex,
			startColumnIndex,
			endColumnIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'Hi, are you?',
				selected: false,
			},
		]);
	});

	it('should delete text in second row', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'See you',
				selected: false,
			},
			{
				key: '2',
				text: 'Hi, how are you?',
				selected: false,
			},
		];
		const rowIndex = 1;
		const startColumnIndex = 3;
		const endColumnIndex = 7;

		const newRows = deleteTextAction({
			currentRows,
			rowIndex,
			startColumnIndex,
			endColumnIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'See you',
				selected: false,
			},
			{
				key: '2',
				text: 'Hi, are you?',
				selected: false,
			},
		]);
	});

	it('should delete text and focus at the start of deleted text', () => {
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi, how are you?',
				selected: false,
			},
		];
		const rowIndex = 0;
		const startColumnIndex = 3;
		const endColumnIndex = 7;
		const shouldFocus = true;

		const newRows = deleteTextAction({
			currentRows,
			rowIndex,
			startColumnIndex,
			endColumnIndex,
			shouldFocus,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'Hi, are you?',
				selected: false,
				focusColumn: 3,
			},
		]);
	});
});

describe('pasteRowsAction', () => {
	it('should paste nothing if clipboard is empty', () => {
		const rowIndex = 0;
		const columnIndex = 2;
		const rowsToPaste = [''];
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		];

		const newRows = pasteRowsAction({
			currentRows,
			rowIndex,
			columnIndex,
			rowsToPaste,
		});

		expect(newRows).toEqual(currentRows);
	});

	it('should paste text at the starting of a row', () => {
		const rowIndex = 0;
		const columnIndex = 0;
		const rowsToPaste = ['After dot I will say Hi. '];
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		];

		const newRows = pasteRowsAction({
			currentRows,
			rowIndex,
			columnIndex,
			rowsToPaste,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'After dot I will say Hi. Hi',
				selected: false,
			},
		]);
	});

	it('should paste text in the middle of a row', () => {
		const rowIndex = 0;
		const columnIndex = 4;
		const rowsToPaste = ['how '];
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi, are you?',
				selected: false,
			},
		];

		const newRows = pasteRowsAction({
			currentRows,
			rowIndex,
			columnIndex,
			rowsToPaste,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'Hi, how are you?',
				selected: false,
			},
		]);
	});

	it('should paste text at the ending of a row', () => {
		const rowIndex = 0;
		const columnIndex = 7;
		const rowsToPaste = [' are you?'];
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi, how',
				selected: false,
			},
		];

		const newRows = pasteRowsAction({
			currentRows,
			rowIndex,
			columnIndex,
			rowsToPaste,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'Hi, how are you?',
				selected: false,
			},
		]);
	});

	it('should paste two rows at the starting of a row', () => {
		const rowIndex = 0;
		const columnIndex = 0;
		const rowsToPaste = ['Hi,', 'How are '];
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'you?',
				selected: false,
			},
		];

		const newRows = pasteRowsAction({
			currentRows,
			rowIndex,
			columnIndex,
			rowsToPaste,
		});

		expect(newRows.map((x) => x.text)).toEqual(['Hi,', 'How are you?']);
	});

	it('should paste two rows in the middle of a row', () => {
		const rowIndex = 0;
		const columnIndex = 2;
		const rowsToPaste = [' mate,', 'How are'];
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi you?',
				selected: false,
			},
		];

		const newRows = pasteRowsAction({
			currentRows,
			rowIndex,
			columnIndex,
			rowsToPaste,
		});

		expect(newRows.map((x) => x.text)).toEqual(['Hi mate,', 'How are you?']);
	});

	it('should paste two rows at the ending of a row', () => {
		const rowIndex = 0;
		const columnIndex = 2;
		const rowsToPaste = [' mate,', 'How are you?'];
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		];

		const newRows = pasteRowsAction({
			currentRows,
			rowIndex,
			columnIndex,
			rowsToPaste,
		});

		expect(newRows.map((x) => x.text)).toEqual(['Hi mate,', 'How are you?']);
	});

	it('should focus after paste two rows at the starting of a row', () => {
		const rowIndex = 0;
		const columnIndex = 0;
		const rowsToPaste = ['Hi,', 'How are '];
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'you?',
				selected: false,
			},
		];

		const newRows = pasteRowsAction({
			currentRows,
			rowIndex,
			columnIndex,
			rowsToPaste,
			shouldFocus: true,
		});

		expect(newRows[1].focusColumn).toEqual(8);
	});

	it('should focus after paste two rows in the middle of a row', () => {
		const rowIndex = 0;
		const columnIndex = 2;
		const rowsToPaste = [' mate,', 'How are'];
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi you?',
				selected: false,
			},
		];

		const newRows = pasteRowsAction({
			currentRows,
			rowIndex,
			columnIndex,
			rowsToPaste,
			shouldFocus: true,
		});

		expect(newRows[1].focusColumn).toEqual(7);
	});

	it('should focus after paste two rows at the ending of a row', () => {
		const rowIndex = 0;
		const columnIndex = 2;
		const rowsToPaste = [' mate,', 'How are you?'];
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		];

		const newRows = pasteRowsAction({
			currentRows,
			rowIndex,
			columnIndex,
			rowsToPaste,
			shouldFocus: true,
		});

		expect(newRows[1].focusColumn).toEqual(12);
	});
});

describe('deleteSelectionAction', () => {
	it('should delete text at the beginning of a row', () => {
		const startRowIndex = 0;
		const startColumnIndex = 0;
		const endRowIndex = 0;
		const endColumnIndex = 4;
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi, how are you?',
				selected: false,
			},
		];

		const newRows = deleteSelectionAction({
			currentRows,
			startRowIndex,
			startColumnIndex,
			endRowIndex,
			endColumnIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'how are you?',
				selected: false,
			},
		]);
	});

	it('should delete text in the middle of a row', () => {
		const startRowIndex = 0;
		const startColumnIndex = 4;
		const endRowIndex = 0;
		const endColumnIndex = 8;
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi, how are you?',
				selected: false,
			},
		];

		const newRows = deleteSelectionAction({
			currentRows,
			startRowIndex,
			startColumnIndex,
			endRowIndex,
			endColumnIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'Hi, are you?',
				selected: false,
			},
		]);
	});

	it('should delete text at the end of a row', () => {
		const startRowIndex = 0;
		const startColumnIndex = 11;
		const endRowIndex = 0;
		const endColumnIndex = 16;
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi, how are you?',
				selected: false,
			},
		];

		const newRows = deleteSelectionAction({
			currentRows,
			startRowIndex,
			startColumnIndex,
			endRowIndex,
			endColumnIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'Hi, how are',
				selected: false,
			},
		]);
	});

	it('should delete all the text in a row', () => {
		const startRowIndex = 0;
		const startColumnIndex = 0;
		const endRowIndex = 0;
		const endColumnIndex = 16;
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi, how are you?',
				selected: false,
			},
		];

		const newRows = deleteSelectionAction({
			currentRows,
			startRowIndex,
			startColumnIndex,
			endRowIndex,
			endColumnIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: '',
				selected: false,
			},
		]);
	});

	it('should delete a row', () => {
		const startRowIndex = 0;
		const startColumnIndex = 2;
		const endRowIndex = 1;
		const endColumnIndex = 12;
		const currentRows: RowWithSelectedInfo[] = [
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
			{
				key: '2',
				text: 'How are you?',
				selected: false,
			},
		];

		const newRows = deleteSelectionAction({
			currentRows,
			startRowIndex,
			startColumnIndex,
			endRowIndex,
			endColumnIndex,
		});

		expect(newRows).toEqual([
			{
				key: '1',
				text: 'Hi',
				selected: false,
			},
		]);
	});
});
