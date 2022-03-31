import React from 'react';
import classes from './styles.module.css';
import { ANNOTATION_CONTAINER_KEY, COLUMN_POSITION } from './constants';
import ContentEditable from '../content-editable/ContentEditable';
import { useLocalStorageWithRef } from '../../hooks/useLocalStorageWithRef';

export interface IAnnotationContainerProps {
  position: COLUMN_POSITION;
}

const AnnotationContainer: React.VFC<IAnnotationContainerProps> = ({ position }) => {
  const [html, setHtml] = useLocalStorageWithRef(`${ANNOTATION_CONTAINER_KEY}_${position}`, '');

  const handleChange = (newValue: string) => {
    setHtml(newValue);
  };

  return (
    <ContentEditable onChange={handleChange} className={classes.annotationContainer} html={html} />
  );
};

export default AnnotationContainer;
