import React, {useContext, memo} from 'react';
import uuid from 'uuid/v4';
import Message from './Message';
import './ChatWindow.css';
import {ChatContext} from '../contexts/chatContext'



function ChatWindow(){
    const {chatData} = useContext(ChatContext);
    const messages = () => {
        for(let i = 0; i < chatData.groups.length; i++){
            if(chatData.groups[i]._id === chatData.selected){
                return chatData.groups[i].messages; 
            }
        }
        return [];
    }

    return(
        <div className='ChatWindow'>
            <ul>
                {messages().map( message => <Message key={uuid()} text={message}/> )}
            </ul>
        </div>
    );
}

export default ChatWindow;