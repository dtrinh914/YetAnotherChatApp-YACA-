import React from 'react';
import uuid from 'uuid/v4';
import Message from './Message';
import './ChatWindow.css';

function ChatWindow({currentGroup}){
    let messages = [];
    let memberMap = currentGroup.memberMap;
    //loops through the messages array and joins the id field of each message with the member info
    messages = currentGroup.messages.map( message => {return {...message, username: memberMap[message.id].username}});

    return(
        <div className='ChatWindow'>
            <ul>
                {messages.map( message => <Message key={uuid()} message={message}/> )}
            </ul>
        </div>
    );
}

export default ChatWindow;