import { generateRandomId } from '@/utils/utils';
import { splitRow } from '../logic';
import {
	AddRowActionParams,
	AddTextActionParams,
	DeleteRowActionParams,
	DeleteTextActionParams,
	PasteRowsActionParams,
} from './types';
import { addTextAtPosition, removeCharsFromString } from '@/components/content-editable/logic/utils/utils';
import { RowWithSelectedInfo } from '@/components/content-editable/types';

export const addRowAction = ({
	currentRows,
	rowToAdd,
	insertRowAtIndex,
	insertColumnAtIndex,
	shouldFocusNewRow,
}: AddRowActionParams): RowWithSelectedInfo[] => {
	const currentRow = currentRows[insertRowAtIndex - 1];

	const [, newRow] = splitRow(currentRow, insertColumnAtIndex);
	newRow.text = `${rowToAdd.text}${newRow.text}`;
	newRow.key = rowToAdd.key;

	if (shouldFocusNewRow) {
		newRow.focusColumn = rowToAdd.text.length;
	}

	currentRows.splice(insertRowAtIndex, 0, newRow);
	return currentRows;
};

export const deleteRowAction = ({
	currentRows,
	deleteRowIndex,
	shouldFocusPrecedentRow,
}: DeleteRowActionParams): RowWithSelectedInfo[] => {
	if (shouldFocusPrecedentRow) {
		const precedentRow = currentRows[deleteRowIndex - 1];
		precedentRow.focusColumn = precedentRow.text.length;
	}

	currentRows.splice(deleteRowIndex, 1);
	return currentRows;
};

export const addTextAction = ({
	currentRows,
	shouldFocusAtEndOfAddedText,
	insertText,
	rowIndex,
	columnIndex,
}: AddTextActionParams) => {
	const rowToUpdate = currentRows[rowIndex];
	rowToUpdate.text = addTextAtPosition(rowToUpdate.text, columnIndex, insertText);

	if (shouldFocusAtEndOfAddedText) {
		rowToUpdate.focusColumn = columnIndex + insertText.length;
	}

	return currentRows;
};

export const deleteTextAction = ({
	currentRows,
	shouldFocus,
	startColumnIndex,
	endColumnIndex,
	rowIndex,
}: DeleteTextActionParams): RowWithSelectedInfo[] => {
	const rowToUpdate = currentRows[rowIndex];
	rowToUpdate.text = removeCharsFromString(rowToUpdate.text, startColumnIndex, endColumnIndex);

	if (shouldFocus) {
		rowToUpdate.focusColumn = startColumnIndex;
	}

	return currentRows;
};

export const pasteRowsAction = ({
	currentRows,
	rowIndex,
	columnIndex,
	rowsToPaste,
}: PasteRowsActionParams): RowWithSelectedInfo[] => {
	if (!rowsToPaste.length || !rowsToPaste.some((text) => text.length)) return currentRows;

	if (rowsToPaste.length === 1) {
		const currentRow = currentRows[rowIndex];
		currentRow.text = addTextAtPosition(currentRow.text, columnIndex, rowsToPaste[0]);

		return currentRows;
	}

	const rowAtIndex = currentRows[rowIndex];
	const firstRowToPaste = rowsToPaste.shift();
	const lastRowToPaste = rowsToPaste.pop();

	const [firstRow, lastRow] = splitRow(rowAtIndex, columnIndex);
	firstRow.text = `${firstRow.text}${firstRowToPaste}`;
	lastRow.text = `${lastRowToPaste}${lastRow.text}`;

	const middleRows = rowsToPaste.map<RowWithSelectedInfo>((text) => ({
		text,
		key: generateRandomId(5),
		selected: false,
	}));

	currentRows.splice(rowIndex, 1, firstRow, ...[...middleRows, lastRow]);

	return currentRows;
};
