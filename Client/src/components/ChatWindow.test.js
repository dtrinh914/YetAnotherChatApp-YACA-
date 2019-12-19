import React from 'react';
import ChatWindow from './ChatWindow';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

test('should match snapshot', () => {
    const {asFragment} = render(<ChatWindow messages={[]} />)
    expect(asFragment()).toMatchSnapshot();
});

test('should render with correct message: Hello there! ', () => {
    const {container} = render(<ChatWindow messages={['Hello there!']} />)
    const message = container.querySelector('li').textContent;
    expect(message).toBe('Hello there!');
})