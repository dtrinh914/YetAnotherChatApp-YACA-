import React from 'react';
import ChatInput from '../components/ChatInput';
import { render, fireEvent, getByTestId, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

test('should match snapshot', () => {
    const {container} = render(<ChatInput />); 
    expect(container).toMatchSnapshot();
});

test('should display hello in input', () => {
    const {container} = render(<ChatInput />);
    const messageInput = getByTestId(container, 'message-input');
    fireEvent.change(messageInput ,{target: {value:'hello'}});
    expect(messageInput).toHaveValue('hello');
});

test('should send message and clear input', () => {
    const {container} = render(<ChatInput onConfirm={()=>{}} />);
    const messageInput = getByTestId(container, 'message-input');
    const sendButton = getByTestId(container, 'send-button');
    fireEvent.change(messageInput ,{target: {value:'hello'}});
    fireEvent.click(sendButton);

    expect(messageInput).toHaveValue('');
});