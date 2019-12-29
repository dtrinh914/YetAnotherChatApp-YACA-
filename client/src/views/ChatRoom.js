import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import io from 'socket.io-client';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import Navbar from '../components/Navbar';
import './ChatRoom.css';

let socket;
function ChatRoom({username, loggedIn, setUserData}){
    const [messages, setMessages] = useState([]);
    let history = useHistory();

    useEffect(() => {
        //redirect if user is not logged in
        if(!loggedIn){
            history.push('/');
        } else {
            socket = io();
            //listens for new messages from the backend and updates state
            socket.on('chat message', (message) => {
                setMessages(prevMsg => [...prevMsg, message]);
            });
        }
    }, [loggedIn, history]);

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