import React from 'react';
import AnnotationContainer from '@/components/annotation-container/AnnotationContainer';
import { COLUMN_POSITION } from '@/components/annotation-container/constants';
import { createArray } from '@/utils/utils';
import { GridNumberToPositionMapType } from './types';
import classes from './styles.module.css';

export interface IGridProps {
  columns: number;
}

const mapColNumberToGridPosition: GridNumberToPositionMapType = {
  1: COLUMN_POSITION.LEFT,
  2: COLUMN_POSITION.RIGHT,
};

const Grid: React.VFC<IGridProps> = ({ columns }) => {
  return (
    <div className={classes.grid} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {createArray(columns, 1).map((colNum) => (
        <AnnotationContainer key={colNum} position={mapColNumberToGridPosition[colNum]} />
      ))}
    </div>
  );
};

export default Grid;
