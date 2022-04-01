import React from 'react';
import classes from './styles.module.css';
import { ANNOTATION_CONTAINER_KEY, COLUMN_POSITION } from './constants';
import ContentEditable from '@/components/content-editable/ContentEditable';
import { useLocalStorageWithRef } from '@/hooks/useLocalStorageWithRef';
import { useTheme } from '@/hooks/useTheme';
import { convertThemeToCssInJs } from '@/utils/utils';

export interface IAnnotationContainerProps {
  position: COLUMN_POSITION;
}

const AnnotationContainer: React.VFC<IAnnotationContainerProps> = ({ position }) => {
  const [html, setHtml] = useLocalStorageWithRef(`${ANNOTATION_CONTAINER_KEY}_${position}`, '');
  const [theme] = useTheme();

  const handleChange = (newValue: string) => {
    setHtml(newValue);
  };

  return (
    <div className={classes.annotationContainer}>
      <ContentEditable
        onChange={handleChange}
        html={html}
        style={{ ...convertThemeToCssInJs(theme), height: '100%', padding: 16 }}
      />
    </div>
  );
};

export default AnnotationContainer;
