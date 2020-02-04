import React from 'react';
import ChatWindow from '../components/ChatWindow';
import {cleanup, getAllByTestId, render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

//seedData
const testMessages = [
                       {id: "5e28c5c185ffc434b337c266", 
                        text:"This is message 1.", 
                        time:"2020-01-22T22:02:35.511Z"
                       },
                       {id: "5e28c5bc85ffc434b337c264", 
                        text:"This is message 2.", 
                        time:"2020-01-22T22:03:36.511Z"
                       },
                       {id: "5e28c5c485ffc434b337c268", 
                        text:"This is message 3.", 
                        time:"2020-01-22T22:04:37.511Z"
                       }
                     ]
const testMemberMap = {
                        "5e28c5c185ffc434b337c266": {username:"test_user1"},
                        "5e28c5bc85ffc434b337c264": {username:"test_user2"},
                        "5e28c5c485ffc434b337c268": {username:"test_user3"}
                      }

afterEach(cleanup);

test('should match snapshot', ()=>{
    const {container} = render(<ChatWindow messages={testMessages} memberMap={testMemberMap}/>);
    expect(container).toMatchSnapshot();
});

test('should display three messages that is formated properly', ()=>{
    const {container} = render(<ChatWindow messages={testMessages} memberMap={testMemberMap}/>);
    const messages = getAllByTestId(container, 'message');

    expect(messages.length).toBe(3);
    expect(messages[0]).toHaveTextContent('This is message 1');
    expect(messages[0]).toHaveTextContent('test_user1');
    expect(messages[0]).toHaveTextContent('02:02 PM');

    expect(messages[1]).toHaveTextContent('This is message 2');
    expect(messages[1]).toHaveTextContent('test_user2');
    expect(messages[1]).toHaveTextContent('02:03 PM');

    expect(messages[2]).toHaveTextContent('This is message 3');
    expect(messages[2]).toHaveTextContent('test_user3');
    expect(messages[2]).toHaveTextContent('02:04 PM');
});

test('should have one properly formatted date divider', () =>{
    const {container} = render(<ChatWindow messages={testMessages} memberMap={testMemberMap}/>);
    const dateDividers = getAllByTestId(container, 'date-divider');

    expect(dateDividers.length).toBe(1);
    expect(dateDividers[0]).toHaveTextContent("Wed January 22, 2020");
});