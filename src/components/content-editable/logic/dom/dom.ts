import { Row } from '@/components/content-editable/types';

export const getDomRowElementByKey = (key: string): HTMLElement | null => {
  return document.querySelector(`div[data-key='${key}']`);
};

export const getDomClosestRowElement = (htmlNode: Node): HTMLElement => {
  // NodeType 3 is for text nodes (that have no attributes)
  if (htmlNode.nodeType !== 3 && (htmlNode as HTMLElement).hasAttribute('data-key')) {
    return htmlNode as HTMLElement;
  }

  if (!htmlNode.parentElement) {
    return document.querySelector('div[data-key]')!;
  }

  if (htmlNode.parentElement.hasAttribute('data-key')) {
    return htmlNode.parentElement!;
  }

  return getDomClosestRowElement(htmlNode.parentElement);
};

export const renderRowTextToHtml = (row: Row): string => {
  if (!row.text) return '<br>';

  return row.text;
};
