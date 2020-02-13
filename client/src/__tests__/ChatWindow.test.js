import React from 'react';
import ChatWindow from '../components/ChatWindow';
import {render} from '@testing-library/react';
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

describe('<ChatWindow> with seedData', () => {
    const {container, getAllByTestId} = render(<ChatWindow messages={testMessages} memberMap={testMemberMap}/>);
    const messages = getAllByTestId('message');
    const dateDividers = getAllByTestId('date-divider');

    it('should match snapshot', ()=>{
        expect(container).toMatchSnapshot();
    });

    it('should display three messages that is formated properly', ()=>{
        expect(messages.length).toBe(3);
        expect(messages[0]).toHaveTextContent('This is message 1','test_user1','02:02 PM');
        expect(messages[1]).toHaveTextContent('This is message 2', 'test_user2', '02:03 PM');
        expect(messages[2]).toHaveTextContent('This is message 3', 'test_user3', '02:04 PM');
    });

    it('should have one properly formatted date divider', () =>{
        expect(dateDividers.length).toBe(1);
        expect(dateDividers[0]).toHaveTextContent("Wed January 22, 2020");
    });
});
