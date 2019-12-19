import React, {useState} from 'react';
import io from 'socket.io-client';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import './ChatRoom.css';

let socket = io('http://localhost:3000');
function ChatRoom(){
    const [messages, setMessages] = useState([]);

    //Sends message to backend
    function newMessage(message){
        socket.emit('chat message', message);
        setMessages([...messages, message])
    }

    //listens for new messages from the backend and updates state
    socket.on('chat message', (message) => {
        setMessages([...messages, message])
    });

    
    return(
        <div>
            <ChatWindow messages={messages} />
            <ChatInput newMessage={newMessage} />
        </div>
    );
}

export default ChatRoom;