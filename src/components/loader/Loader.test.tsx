import React from 'react';
import { render } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  it('should renders progressbar', () => {
    const { getByRole } = render(<Loader />);
    const loader = getByRole('progressbar');
    expect(loader).toBeInTheDocument();
  });
});