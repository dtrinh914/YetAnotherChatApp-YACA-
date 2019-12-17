import React from 'react';
import './ChatWindow.css';

function ChatWindow(props){
    return(
        <div className='ChatWindow'>
            <ul>
                {props.messages.map( message => <li>{message}</li> )}
            </ul>
        </div>
    );
}

export default ChatWindow;