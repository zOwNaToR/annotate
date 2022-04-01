import React, { CSSProperties, useEffect, useRef } from 'react';

export interface IContentEditableProps {
  html: string;
  onChange: (value: string) => void;
  style?: CSSProperties;
}

const ContentEditable: React.VFC<IContentEditableProps> = ({ html, onChange, style }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const lastHtml = useRef<string>('');

  const emitChange = () => {
    const curHtml = divRef.current?.innerHTML ?? '';
    if (curHtml !== lastHtml.current) {
      onChange(curHtml);
    }

    lastHtml.current = html;
  };

  useEffect(() => {
    // On first rendering and if innerHtml is present, skip
    if (!divRef.current || divRef.current.innerHTML) return;

    divRef.current.innerHTML = html;
  }, [html]);

  return (
    <div
      style={style}
      contentEditable
      suppressContentEditableWarning
      ref={divRef}
      onInput={emitChange}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default ContentEditable;
