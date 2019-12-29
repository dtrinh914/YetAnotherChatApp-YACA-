import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import Navbar from '../components/Navbar';
import './ChatRoom.css';
import axios from 'axios';

let socket;
function ChatRoom({history, username, loggedIn, setUserData}){
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        //redirect if user is not logged in
        if(!loggedIn){
            history.push('/');
        }
        socket = io();
        //listens for new messages from the backend and updates state
        socket.on('chat message', (message) => {
            setMessages(prevMsg => [...prevMsg, message]);
        });
    }, []);

    //Sends message to backend
    const newMessage = (message) => {
        socket.emit('chat message', message);
        setMessages(prevMsg => [...prevMsg, message]);
    }

    //Closes all socket connections
    const closeSockets = () => {
        socket.close('chat message');
    }

    return(
        <div>
            <Navbar username={username} history={history} setUserData={setUserData} closeSockets={closeSockets} />
            <ChatWindow messages={messages} />
            <ChatInput newMessage={newMessage} />
        </div>
    );
}

export default ChatRoom;