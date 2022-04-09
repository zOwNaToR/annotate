import React, { CSSProperties, useEffect, useState } from 'react';
import { Row } from './types';
import { onInputLogic, onShortcutLogic } from './logic/logic';
import { setNewCaretPosition } from './logic/selection.logic';
import { getDomRowElementByKey, renderRowTextToHtml } from './logic/dom.logic';

export interface IContentEditableProps {
  htmlStructure: Row[];
  onChange: (htmlStructure: Row[]) => void;
  style?: CSSProperties;
}

const ContentEditable: React.VFC<IContentEditableProps> = ({ htmlStructure, onChange, style }) => {
  const [contentStructure, setContentStructure] = useState<Row[]>(htmlStructure);

  useEffect(() => {
    // Reset the caret after re-render based on row with focusColumn property
    const focusedRow = contentStructure.find((row) => row.focusColumn !== undefined)!;
    const focusedRowDomElement = getDomRowElementByKey(focusedRow.key)!;

    setNewCaretPosition(focusedRowDomElement, focusedRow.focusColumn!);
  }, [contentStructure]);

  const handleInput = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(e);
    const newContentStructure = onInputLogic(e, contentStructure);

    setContentStructure(newContentStructure);
    onChange(newContentStructure);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    console.log(e);
    // const newContentStructure = onInputLogic(e, contentStructure);
    //
    // setContentStructure(newContentStructure);
    // onChange(newContentStructure);
  };

  const handleShortcut = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(e);

    const newContentStructure = onShortcutLogic(e, contentStructure);

    setContentStructure(newContentStructure);
    onChange(newContentStructure);
  };

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      style={{ ...style, overflowY: 'auto' }}
      onKeyDown={handleShortcut}
      onBeforeInput={handleInput}
      onPaste={handlePaste}
    >
      {contentStructure.map((row) => (
        <div
          key={row.key}
          data-key={row.key}
          style={{ whiteSpace: 'pre-wrap', minHeight: '24px' }}
          dangerouslySetInnerHTML={{ __html: renderRowTextToHtml(row) }}
        />
      ))}
    </div>
  );
};

export default ContentEditable;
