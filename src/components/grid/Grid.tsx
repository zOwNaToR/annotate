import React from 'react';
import classes from './styles.module.css';

export interface IGridProps {
	children: React.ReactNode;
}

const Grid: React.VFC<IGridProps> = ({ children }) => {
	return (
		<div className={classes.grid}>
			{children}
		</div>
	);
}

export default Grid;