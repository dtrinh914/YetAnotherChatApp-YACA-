import React from 'react';
import ChatRoom from './ChatRoom';
import { render, cleanup, fireEvent } from '@testing-library/react';

afterEach(cleanup);

test('should match snapshot', () => {
    const {asFragment} = render(<ChatRoom />)
    expect(asFragment()).toMatchSnapshot();
});

test('should type Hello World in chat input, press send, and Hello World should be displayed in chat window', ()=> {
    const {container} = render(<ChatRoom />);
    const ChatInputBox = container.querySelector('.ChatInput textarea');
    const ChatInputButton = container.querySelector('.ChatInput button');
    fireEvent.change(ChatInputBox, {target: {value: 'Hello World'}});
    fireEvent.click(ChatInputButton);

    const message = container.querySelector('.ChatWindow li').textContent;
    expect(message).toBe('Hello World');
})