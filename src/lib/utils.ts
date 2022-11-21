export const addTextAtIndex = (text: string, index: number, textToAdd: string) =>
	`${text.slice(0, index)}${textToAdd}${text.slice(index)}`;
