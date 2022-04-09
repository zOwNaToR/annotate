import React from 'react';
import { Row } from '@/components/content-editable/types';

describe('aaa', () => {
  it('bbb', () => {
    const rows: Row[] = [
      { text: '', key: '' },
      { text: '', key: '' },
    ];

    expect(rows[0] === [...rows][0]).toBe(true);

    // expect(true).toBe(true);
  });
});
