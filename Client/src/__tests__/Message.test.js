import React from 'react';
import Message from '../components/Message';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

test('should match snapshot', () => {
    const {asFragment} = render(<Message text={''} />)
    expect(asFragment()).toMatchSnapshot();
});

test('should render with correct message: Hello there! ', () => {
    const {container} = render(<Message text={['Hello there!']} />)
    const message = container.querySelector('li').textContent;
    expect(message).toBe('Hello there!');
})