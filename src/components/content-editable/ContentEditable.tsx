import React, { CSSProperties, useEffect, useState } from 'react';
import { Row } from './types';
import { onInputLogic } from './logic/logic';
import { setNewCaretPosition } from './logic/selection.logic';
import { getDomRowElementByKey } from './logic/dom.logic';

export interface IContentEditableProps {
  onChange: (stringifiedHtmlStructure: string) => void;
  style?: CSSProperties;
}

const ContentEditable: React.VFC<IContentEditableProps> = ({ onChange, style }) => {
  const [contentStructure, setContentStructure] = useState<Row[]>([
    {
      key: 'first',
      text: '',
      focusColumn: 0,
    },
  ]);

  useEffect(() => {
    const focusedRow = contentStructure.find((row) => row.focusColumn !== undefined)!;
    const focusedRowDomElement = getDomRowElementByKey(focusedRow.key)!;

    setNewCaretPosition(focusedRowDomElement, focusedRow.focusColumn!);
  }, [contentStructure]);

  const handleInput = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const newContentStructure = onInputLogic(e, contentStructure);

    setContentStructure(newContentStructure);
    onChange(JSON.stringify(newContentStructure));
  };

  const handleShortcut = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(e);
  };

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      style={{ ...style, overflowY: 'auto' }}
      onKeyDown={handleShortcut}
      onBeforeInput={handleInput}
    >
      {contentStructure.map((row) => (
        <div key={row.key} data-key={row.key} style={{ whiteSpace: 'pre-wrap' }}>
          {row.text}
        </div>
      ))}
    </div>
  );
};

export default ContentEditable;
