import React from 'react';

export type ReactSetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
