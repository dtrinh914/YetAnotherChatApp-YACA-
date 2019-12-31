import React from 'react';
import uuid from 'uuid/v4';
import Message from './Message';
import './ChatWindow.css';



function ChatWindow({messages}){
    return(
        <div className='ChatWindow'>
            <ul>
                {messages.map( message => <Message key={uuid()} text={message}/> )}
            </ul>
        </div>
    );
}

export default ChatWindow;