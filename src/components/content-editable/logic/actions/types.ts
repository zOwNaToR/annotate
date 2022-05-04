import { RowWithSelectedInfo } from '@/components/content-editable/types';

type BaseAction = {
	currentRows: RowWithSelectedInfo[];
};

export type RowToAdd = {
	key: string;
	text: string;
};

export type AddRowActionParams = BaseAction & {
	rowToAdd: RowToAdd;
	insertRowAtIndex: number;
	insertColumnAtIndex: number;
	shouldFocusNewRow?: boolean;
};

export type DeleteRowActionParams = BaseAction & {
	deleteRowIndex: number;
	shouldFocusPrecedentRow?: boolean;
};

export type AddTextActionParams = BaseAction & {
	insertText: string;
	rowIndex: number;
	columnIndex: number;
	shouldFocusAtEndOfAddedText?: boolean;
};

export type DeleteTextActionParams = BaseAction & {
	rowIndex: number;
	startColumnIndex: number;
	endColumnIndex: number;
	shouldFocus?: boolean;
};

export type PasteRowsActionParams = BaseAction & {
	rowIndex: number;
	columnIndex: number;
	rowsToPaste: string[];
	shouldFocus?: boolean;
};

export type DeleteSelectionActionParams = BaseAction & {
	startRowIndex: number;
	endRowIndex: number;
	startColumnIndex: number;
	endColumnIndex: number;
	shouldFocus?: boolean;
};

export type GetRowSelectionLengthParams = {
	rowText: string;
	rowIndex: number;
	selectedRowsLength: number;
	startColumnIndex: number;
	endColumnIndex: number;
};

export type ShouldMergeRowsParams = {
	rows: RowWithSelectedInfo[];
	selectedRowsLength: number;
	startColumnIndex: number;
	endColumnIndex: number;
};
