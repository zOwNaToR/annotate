import React from 'react';
import AnnotationContainer from '@/components/annotation-container/AnnotationContainer';
import { createArray } from '@/utils/utils';
import classes from './styles.module.css';
import { useTheme } from '@/hooks/useTheme';
import { mapColNumberToGridPosition } from '@/components/grid/constants';

export interface IGridProps {
  columns: number;
}

const Grid: React.VFC<IGridProps> = ({ columns }) => {
  const [theme] = useTheme();

  return (
    <div
      className={classes.grid}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        backgroundColor: theme.values.dividerColor,
      }}
    >
      {createArray(columns, 1).map((colNum) => (
        <AnnotationContainer key={colNum} position={mapColNumberToGridPosition[colNum]} />
      ))}
    </div>
  );
};

export default Grid;
