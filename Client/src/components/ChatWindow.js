import React from 'react';
import uuid from 'uuid/v4';
import Message from './Message';
import './ChatWindow.css';



function ChatWindow(props){
    return(
        <div className='ChatWindow'>
            <ul>
                {props.messages.map( message => <Message key={uuid()} text={message}/> )}
            </ul>
        </div>
    );
}

export default ChatWindow;