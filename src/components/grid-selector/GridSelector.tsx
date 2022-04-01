import React from 'react';

interface GridSelectorProps {
  colNumber: number;
  onClick: (colNumber: number) => void;
}

const GridSelector: React.VFC<GridSelectorProps> = ({ colNumber, onClick }) => {
  return (
    <span style={{ cursor: 'pointer', padding: '5px' }} onClick={() => onClick(colNumber)}>
      {colNumber}
    </span>
  );
};

export default GridSelector;
