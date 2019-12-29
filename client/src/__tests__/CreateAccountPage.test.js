import React from 'react';
import CreateAccountPage from '../views/CreateAccountPage';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

test('should match snapshot', () => {
    const {asFragment} = render(<CreateAccountPage />)
    expect(asFragment()).toMatchSnapshot();
});