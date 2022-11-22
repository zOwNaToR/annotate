import { AnnotateSelection } from '../lib/editor-state-manager/AnnotateSelection';

describe('set method should set Caret type', () => {
	it('sets the Caret at the beginning of first item', () => {
		const selection = new AnnotateSelection();

		selection.set({
			anchor: { key: 'first', offset: 0 },
			focus: { key: 'first', offset: 0 },
		});

		expect(selection.type).toBe('Caret');
		expect(selection.anchor).toEqual({
			key: 'first',
			offset: 0,
		});
		expect(selection.focus).toEqual({
			key: 'first',
			offset: 0,
		});
	});
});

describe('set method should set Range type', () => {
	it('selects first char', () => {
		const selection = new AnnotateSelection();

		selection.set({
			anchor: { key: 'first', offset: 0 },
			focus: { key: 'first', offset: 1 },
		});

		expect(selection.type).toBe('Range');
		expect(selection.anchor).toEqual({
			key: 'first',
			offset: 0,
		});
		expect(selection.focus).toEqual({
			key: 'first',
			offset: 1,
		});
	});

	it('selects middle of first row', () => {
		const selection = new AnnotateSelection();

		selection.set({
			anchor: { key: 'first', offset: 3 },
			focus: { key: 'first', offset: 6 },
		});

		expect(selection.type).toBe('Range');
		expect(selection.anchor).toEqual({
			key: 'first',
			offset: 3,
		});
		expect(selection.focus).toEqual({
			key: 'first',
			offset: 6,
		});
	});

	it('selects entire first row and first char of second row', () => {
		const selection = new AnnotateSelection();

		selection.set({
			anchor: { key: 'first', offset: 0 },
			focus: { key: 'second', offset: 1 },
		});

		expect(selection.type).toBe('Range');
		expect(selection.anchor).toEqual({
			key: 'first',
			offset: 0,
		});
		expect(selection.focus).toEqual({
			key: 'second',
			offset: 1,
		});
	});
});

describe('isSet', () => {
	it('should return false on init', () => {
		const selection = new AnnotateSelection();

		expect(selection.isSet()).toBe(false);
	});

	it('should return true after set', () => {
		const selection = new AnnotateSelection();

		selection.set({
			anchor: { key: 'first', offset: 0 },
			focus: { key: 'first', offset: 0 },
		});

		expect(selection.isSet()).toBe(true);

	});
});
