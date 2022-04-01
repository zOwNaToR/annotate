import React from 'react';
import classes from './styles.module.css';

export interface IFloatingContainerProps {}

const FloatingContainer: React.FC<IFloatingContainerProps> = ({ children }) => {
  return <div className={classes.floatingContainer}>{children}</div>;
};

export default FloatingContainer;
