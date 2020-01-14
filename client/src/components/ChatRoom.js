import React, {useEffect, useContext} from 'react';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import io from 'socket.io-client';
import {ChatContext} from '../contexts/chatContext';

let socket;
function ChatRoom(){
    const {chatData, chatDispatch} = useContext(ChatContext);
    
    useEffect(() => {
        socket = io();
        //listens for new messages from the backend and updates state
        socket.on('message', (room, message) => {
            chatDispatch({type:'NEW_MSG', room:room, message:message})
        });
        
        //on connect joins the rooms on the client side
        socket.on('connect', () => {
            chatData.groups.forEach(group => {
                socket.emit('room', group._id)
            })
        })

        return function cleanup(){
            socket.close();
        }
    // eslint-disable-next-line
    },[chatDispatch])

    const newMessage = (message) => {
        socket.emit('message', chatData.selected._id, message);
        chatDispatch({type:'NEW_MSG', room:chatData.selected._id, message:message});
    }

    return(
        <div className='ChatRoom'>
            <ChatWindow />
            <ChatInput onConfirm={newMessage} />
        </div>
    );
}

export default ChatRoom;