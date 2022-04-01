import React from 'react';
import classes from './styles.module.css';

interface GridSelectorProps {
  colNumber: number;
  onClick: (colNumber: number) => void;
}

const GridSelector: React.VFC<GridSelectorProps> = ({ colNumber, onClick }) => {
  return (
    <span className={classes.gridSelector} onClick={() => onClick(colNumber)}>
      {colNumber}
    </span>
  );
};

export default GridSelector;
