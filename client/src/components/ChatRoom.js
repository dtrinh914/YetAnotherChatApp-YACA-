import React from 'react';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import './ChatRoom.css';

function ChatRoom({messages, newMessage}){
    return(
        <div className='ChatRoom'>
            <ChatWindow messages={messages} />
            <ChatInput newMessage={newMessage} />
        </div>
    );
}

export default ChatRoom;