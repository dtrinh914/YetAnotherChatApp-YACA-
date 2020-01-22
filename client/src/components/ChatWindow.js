import React, {useContext} from 'react';
import uuid from 'uuid/v4';
import Message from './Message';
import './ChatWindow.css';
import {ChatContext} from '../contexts/chatContext'



function ChatWindow(){
    const {chatData} = useContext(ChatContext);
    let currentGroup = chatData.groups[chatData.selected.index];
    //create a hashtable using the memberID as a key and the member info as the value
    let memberMap = {};
    currentGroup.activeMembers.map( member => memberMap[member._id] = {username: member.username});
    //loops through the messages array and joins the id field of each message with the member info
    let messages = currentGroup.messages.map( message => {return {...message, username: memberMap[message.id].username}});

    return(
        <div className='ChatWindow'>
            <ul>
                {messages.map( message => <Message key={uuid()} message={message}/> )}
            </ul>
        </div>
    );
}

export default ChatWindow;