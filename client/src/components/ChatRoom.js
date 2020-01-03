import React, {useEffect, useContext} from 'react';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import './ChatRoom.css';
import io from 'socket.io-client';
import {ChatContext} from '../contexts/chatContext'

let socket;
function ChatRoom(){
    const {chatData, dispatch} = useContext(ChatContext);
    
    useEffect(() => {
        socket = io();
        //listens for new messages from the backend and updates state
        socket.on('message', (room, message) => {
            dispatch({type:'NEWMSG', room:room, message:message})
        });
        
        //on connect joins the rooms on the client side
        socket.on('connect', () => {
            chatData.groups.forEach(group => {
                socket.emit('room', group._id)
            })
        })
    },[])

    const newMessage = (message) => {
        socket.emit('message', chatData.selected, message);
        dispatch({type:'NEW_MSG', room:chatData.selected, message:message});
    }

    return(
        <div className='ChatRoom'>
            <ChatWindow />
            <ChatInput onConfirm={newMessage} />
        </div>
    );
}

export default ChatRoom;