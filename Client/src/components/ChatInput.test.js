import React from 'react';
import ChatInput from './ChatInput';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

test('should match snapshot', () => {
    const {asFragment} = render(<ChatInput />)
    expect(asFragment()).toMatchSnapshot();
});
