import React from 'react';
import optionNumber from '../annotation-container/AnnotationContainer';
import GridSelector from './components/GridSelector';

export interface ILayoutSelectorProps {
  columnOptionsArray: number[];
  onLayoutChange: (columnOption: number) => void;
}

const LayoutSelector: React.VFC<ILayoutSelectorProps> = ({
  columnOptionsArray,
  onLayoutChange,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
        display: 'flex',
        gap: '5px',
        padding: '10px',
        backgroundColor: 'lightgray',
        borderRadius: '10px',
      }}
    >
      {columnOptionsArray.map((columnOption) => (
        <GridSelector
          key={columnOption}
          colNumber={columnOption}
          onClick={() => onLayoutChange(columnOption)}
        />
      ))}
    </div>
  );
};

export default LayoutSelector;
