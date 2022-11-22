export const addTextAtIndex = (text: string, index: number, textToAdd: string) =>
	`${text.slice(0, index)}${textToAdd}${text.slice(index)}`;

export const replaceText = (initialText: string, from: number, to: number, newText: string) =>
	`${initialText.slice(0, from)}${newText}${initialText.slice(to)}`;

export const isUndefined = (obj: any) => typeof obj === 'undefined';

export const isBetween = (n: number, from: number, to: number) => from <= n && n <= to;
