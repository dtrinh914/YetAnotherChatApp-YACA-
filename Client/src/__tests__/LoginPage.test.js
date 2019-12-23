import React from 'react';
import LoginPage from '../views/LoginPage';
import { render, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

afterEach(cleanup);

test('should match snapshot', () => {
    const {asFragment} = render(<BrowserRouter><LoginPage /></BrowserRouter>)
    expect(asFragment()).toMatchSnapshot();
});