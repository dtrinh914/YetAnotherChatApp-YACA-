import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import './ChatRoom.css';
import axios from 'axios';

let socket;
function ChatRoom(){
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket = io();
        //listens for new messages from the backend and updates state
        socket.on('chat message', (message) => {
            setMessages(prevMsg => [...prevMsg, message]);
        });
    }, []);

    //Sends message to backend
    function newMessage(message){
        socket.emit('chat message', message);
        setMessages(prevMsg => [...prevMsg, message]);
    }

    return(
        <div>
            <ChatWindow messages={messages} />
            <ChatInput newMessage={newMessage} />
        </div>
    );
}

export default ChatRoom;