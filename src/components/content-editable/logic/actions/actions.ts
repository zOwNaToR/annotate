import { generateRandomId } from '@/utils/utils';
import { splitRow } from '../logic';
import {
	AddRowActionParams,
	AddTextActionParams,
	DeleteRowActionParams,
	DeleteSelectionActionParams,
	DeleteTextActionParams,
	GetRowSelectionLengthParams,
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
	shouldFocus,
}: PasteRowsActionParams): RowWithSelectedInfo[] => {
	if (!rowsToPaste.length || !rowsToPaste.some((text) => text.length)) return currentRows;

	if (rowsToPaste.length === 1) {
		const currentRow = currentRows[rowIndex];
		currentRow.text = addTextAtPosition(currentRow.text, columnIndex, rowsToPaste[0]);

		if (shouldFocus) {
			currentRow.focusColumn = rowsToPaste[0].length;
		}

		return currentRows;
	}

	const rowAtIndex = currentRows[rowIndex];
	const firstRowToPaste = rowsToPaste.shift()!;
	const lastRowToPaste = rowsToPaste.pop()!;
	const middleRowsToPaste = rowsToPaste.map<RowWithSelectedInfo>((text) => ({
		text,
		key: generateRandomId(5),
		selected: false,
	}));

	const [firstRow, lastRow] = splitRow(rowAtIndex, columnIndex);
	firstRow.text = `${firstRow.text}${firstRowToPaste}`;
	lastRow.text = `${lastRowToPaste}${lastRow.text}`;

	if (shouldFocus) {
		lastRow.focusColumn = lastRowToPaste.length;
	}

	currentRows.splice(rowIndex, 1, firstRow, ...[...middleRowsToPaste, lastRow]);
	return currentRows;
};

export const deleteSelectionAction = ({
	currentRows,
	startRowIndex,
	endRowIndex,
	startColumnIndex,
	endColumnIndex,
}: DeleteSelectionActionParams): RowWithSelectedInfo[] => {
	const isOnlyOneRow = startRowIndex === endRowIndex;

	if (isOnlyOneRow) {
		const rowToUpdate = currentRows[startRowIndex];
		rowToUpdate.text = removeCharsFromString(rowToUpdate.text, startColumnIndex, endColumnIndex);

		return currentRows;
	}

	const rowsToUpdate = currentRows.splice(startRowIndex, endRowIndex + 1);

	const updatedRows = rowsToUpdate.reduce<RowWithSelectedInfo[]>((acc, curr, i, array) => {
		const isFirstRow = i === 0;
		const isLastRow = i === array.length - 1;
		const isFullySelected =
			getRowSelectionLength({
				rowText: curr.text,
				rowIndex: i,
				startRowIndex,
				endRowIndex,
				startColumnIndex,
				endColumnIndex,
			}) === curr.text.length;

		if (!shouldDeleteRow(isFirstRow, isLastRow, isFullySelected)) {
			if (isFirstRow) curr.text = removeCharsFromString(curr.text, startColumnIndex, endColumnIndex);
			if (isLastRow) curr.text = removeCharsFromString(curr.text, 0, endColumnIndex);

			acc.push(curr);
		}

		return acc;
	}, []);

	currentRows.splice(startRowIndex, 0, ...updatedRows);

	return currentRows;
};

const shouldDeleteRow = (isFirstRow: boolean, isLastRow: boolean, isFullySelected: boolean): boolean => {
	if (isFirstRow) return false;
	if (isLastRow) return isFullySelected;

	// Always delete middle rows
	return true;
};

const getRowSelectionLength = ({
	rowText,
	rowIndex,
	startRowIndex,
	endRowIndex,
	startColumnIndex,
	endColumnIndex,
}: GetRowSelectionLengthParams): number => {
	if (rowIndex < startRowIndex || rowIndex > endRowIndex) throw Error('Row index is out of range');

	// First row
	if (rowIndex === startRowIndex) {
		// Only one row selected
		if (startRowIndex === endRowIndex) return endColumnIndex - startColumnIndex;

		return rowText.length - startColumnIndex;
	}

	// Last row
	if (rowIndex === endRowIndex) return endColumnIndex;

	// Middle row
	return rowText.length;
};
