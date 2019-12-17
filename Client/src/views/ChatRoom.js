import React, {useState} from 'react';
import ChatWindow from '../components/ChatWindow'
import ChatInput from '../components/ChatInput'
import './ChatRoom.css'

function ChatRoom(){
    const [messages, setMessages] = useState([]);
    function newMessage(message){
        setMessages([...messages, message])
    }
    return(
        <div>
            <ChatWindow messages={messages} />
            <ChatInput newMessage={newMessage} />
        </div>
    );
}

export default ChatRoom;