import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { Row, RowSelections } from '@/components/content-editable/types';
import { onInputLogic } from '@/components/content-editable/logic';

export interface IContentEditableProps {
  html: string;
  onChange: (value: string) => void;
  style?: CSSProperties;
}

const ContentEditable: React.VFC<IContentEditableProps> = ({ html, onChange, style }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const lastHtml = useRef<string>('');

  const [contentStructure, setContentStructure] = useState<Row[]>([
    {
      key: 'first',
      text: '',
    },
  ]);

  const handleInput = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // const curHtml = divRef.current?.innerHTML ?? '';
    // if (curHtml !== lastHtml.current) {
    //   onChange(curHtml);
    // }
    //
    // lastHtml.current = html;

    setContentStructure(onInputLogic(e, contentStructure));
  };

  const handleShortcut = () => {};

  useEffect(() => {
    // Set html only after first render and if html is not already set
    if (!divRef.current || divRef.current.innerHTML) return;

    divRef.current.innerHTML = html;
  }, [html]);

  return (
    <div
      style={{ ...style, overflowY: 'auto' }}
      contentEditable
      suppressContentEditableWarning
      ref={divRef}
      onKeyDown={handleShortcut}
      onBeforeInput={handleInput}
      // dangerouslySetInnerHTML={{ __html: html }}
    >
      {contentStructure.map((row, index) => (
        <div key={row.key} data-key={row.key} style={{ whiteSpace: 'nowrap' }}>
          {row.text}
        </div>
      ))}
    </div>
  );
};

export default ContentEditable;
