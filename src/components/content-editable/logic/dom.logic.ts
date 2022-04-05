export const getDomRowElementByKey = (key: string): HTMLElement | null => {
  return document.querySelector(`div[data-key='${key}']`);
};

// TODO Check if it is possible to replace this logic with with closest() function
export const getDomClosestRowElement = (htmlNode: Node): HTMLElement => {
  if (!htmlNode.parentElement) {
    return document.querySelector('div[data-key]')!;
  }

  if (htmlNode.parentElement.hasAttribute('data-key')) {
    return htmlNode.parentElement!;
  }

  return getDomClosestRowElement(htmlNode.parentElement);
};
