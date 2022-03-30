import React from 'react';
import classes from './styles.module.css';

export interface IGridProps {
  children: React.ReactNode;
  columns: number;
}

const Grid: React.VFC<IGridProps> = ({ children, columns }) => {
  return (
    <div className={classes.grid} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {children}
    </div>
  );
};

export default Grid;
