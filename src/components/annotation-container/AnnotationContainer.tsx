import React, { FormEvent, useState } from 'react';
import classes from './styles.module.css';

export interface IAnnotationContainerProps {

}

const AnnotationContainer: React.VFC<IAnnotationContainerProps> = ({  }) => {
	// useState hook
	const [html, setHtml] = useState('');

	const handleChange = (e: FormEvent<HTMLDivElement>) => {
		setHtml(e.currentTarget.innerHTML);
	}

	return (
		<div contentEditable suppressContentEditableWarning onChange={handleChange} className={classes.container}>
			{html}
		</div>
	);
}

export default AnnotationContainer;