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
	ShouldMergeRowsParams,
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
				selectedRowsLength: rowsToUpdate.length,
				startColumnIndex,
				endColumnIndex,
			}) === curr.text.length;

		if (!shouldDeleteRow(isFirstRow, isLastRow, isFullySelected)) {
			if (isFirstRow) curr.text = removeCharsFromString(curr.text, startColumnIndex, curr.text.length);
			if (isLastRow) curr.text = removeCharsFromString(curr.text, 0, endColumnIndex);

			acc.push(curr);
		}

		return acc;
	}, []);

	if (
		shouldMergeRows({
			rows: updatedRows,
			selectedRowsLength: rowsToUpdate.length,
			startColumnIndex,
			endColumnIndex,
		})
	) {
		updatedRows[0] = mergeRows(updatedRows[0], updatedRows.at(-1)!, startColumnIndex, endColumnIndex);
		updatedRows.pop();
	}

	currentRows.splice(startRowIndex, 0, ...updatedRows);

	return currentRows;
};

// Ciao
// Io
// Sono
// Omar

const shouldDeleteRow = (isFirstRow: boolean, isLastRow: boolean, isFullySelected: boolean): boolean => {
	if (isFirstRow) return false;
	if (isLastRow) return isFullySelected;

	// Always delete middle rows
	return true;
};

const getRowSelectionLength = ({
	rowText,
	rowIndex,
	selectedRowsLength,
	startColumnIndex,
	endColumnIndex,
}: GetRowSelectionLengthParams): number => {
	if (rowIndex < 0 || rowIndex > selectedRowsLength) throw Error('Row index is out of range');

	// Only one row selected
	if (selectedRowsLength === 1) return endColumnIndex - startColumnIndex;
	// First row
	if (rowIndex === 0) return rowText.length - startColumnIndex;
	// Last row
	if (rowIndex === selectedRowsLength - 1) return endColumnIndex;

	// Middle row
	return rowText.length;
};

const shouldMergeRows = ({ rows, selectedRowsLength, startColumnIndex, endColumnIndex }: ShouldMergeRowsParams) => {
	if (rows.length < 2) return false;
	if (rows[0].text.length === 0) return true;

	const lastRowIsFullySelected =
		getRowSelectionLength({
			rowText: rows.at(-1)!.text,
			rowIndex: rows.length - 1,
			selectedRowsLength,
			startColumnIndex,
			endColumnIndex,
		}) > 0;

	return !lastRowIsFullySelected;
};

export const mergeRows = (
	mainRow: RowWithSelectedInfo, // MainRow will be focused if focusRow is true
	secondaryRow: RowWithSelectedInfo,
	startColumnIndex: number,
	endColumnIndex: number,
): RowWithSelectedInfo => {
	let text = `${mainRow.text.substring(0, startColumnIndex)}${secondaryRow.text.substring(
		endColumnIndex,
		secondaryRow.text.length,
	)}`;

	return {
		...mainRow,
		text,
	};
};
