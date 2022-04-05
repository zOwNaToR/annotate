import React from 'react';
import classes from './styles.module.css';
import { ANNOTATION_CONTAINER_KEY, COLUMN_POSITION } from './constants';
import ContentEditable from '@/components/content-editable/ContentEditable';
import { useLocalStorageWithRef } from '@/hooks/useLocalStorageWithRef';
import { useTheme } from '@/hooks/useTheme';
import { convertThemeToCssInJs } from '@/utils/utils';
import { Row } from '@/components/content-editable/types';

export interface IAnnotationContainerProps {
  position: COLUMN_POSITION;
}

const AnnotationContainer: React.VFC<IAnnotationContainerProps> = ({ position }) => {
  const [theme] = useTheme();
  const [htmlStructure, setHtmlStructure] = useLocalStorageWithRef<Row[]>(`${ANNOTATION_CONTAINER_KEY}_${position}`, [
    {
      key: 'first',
      text: '',
      focusColumn: 0,
    },
  ]);

  const handleChange = (newValue: Row[]) => {
    setHtmlStructure(newValue);
  };

  return (
    <div className={classes.annotationContainer}>
      <ContentEditable
        htmlStructure={htmlStructure}
        onChange={handleChange}
        style={{ ...convertThemeToCssInJs(theme), height: '100%', padding: 16 }}
      />
    </div>
  );
};

export default AnnotationContainer;
