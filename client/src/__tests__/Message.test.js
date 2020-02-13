import React from 'react';
import Message from '../components/Message';
import {render, getByTestId, cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

//seedData
const testMessage = {
                    "id": "5e28c5c185ffc434b337c266",
                    "text": "This is a test message.",
                    "time": "2020-01-22T22:18:50.097Z",
                    "username": "test_user",
                    "type": "message"
                }

test('should match snapshot', ()=>{
    const {container} = render(<Message message={testMessage} />);
    expect(container).toMatchSnapshot();
});

test('should display username and message', () => {
    const {container} = render(<Message message={testMessage} />);
    const usernameField = getByTestId(container, 'username-time');
    const textField = getByTestId(container, 'text-field');
 
    expect(usernameField).toHaveTextContent('test_user');
    expect(textField).toHaveTextContent('This is a test message.');
});

test('should display the correctly formated date', ()=>{
    const {container} = render(<Message message={testMessage} />);
    const timeField = getByTestId(container, 'username-time');

    expect(timeField).toHaveTextContent('02:18 PM');
});