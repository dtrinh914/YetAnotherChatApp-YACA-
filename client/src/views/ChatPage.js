import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from '../components/Navbar';
import Groups from '../components/Groups';
import ChatRoom from '../components/ChatRoom';
import uuid from 'uuid/v4';
import './ChatPage.css';

let socket;
function Chat({username, loggedIn, setUserData}){
    const history = useHistory();
    const seedData = [
        {groupName: 'Group 1', messages:['Hello','this','is','group','1'], members: [], id: '_xy34'},
        {groupName: 'Group 2', messages:['Hello','this','is','group','2'], members: [], id: '_yy33'},
        {groupName: 'Group 3', messages:['Hello','this','is','group','3'], members: [], id: '_zz54'} 
    ];

    const [chatData, setChatData] = useState(seedData);
    const [selectedGroup, setSelectedGroup] = useState(chatData[0].id);

    useEffect(() => {
        //redirect if user is not logged in
        if(!loggedIn){
            history.push('/');
        } else {
            socket = io();
            socket.on('connect', () => {
                socket.emit('room', '_xy34');
                socket.emit('room', '_yy33');
                socket.emit('room', '_zz54');
            })
            socket.on('message', (message) => {
                console.log(message);
            })
            //listens for new messages from the backend and updates state
            socket.on('message', (room, message) => {
                setChatData( groups => groups.map( group => {
                    if(group.id === room ){
                        const newMessages = [...group.messages, message];
                        return {...group, messages:newMessages}
                    } else {
                        return group;
                    }
                }));
            });
        }
    }, [loggedIn, history]);

    const newMessage = (message) => {
        socket.emit('message', selectedGroup, message);
        setChatData( groups => groups.map( group => {
            if(group.id === selectedGroup){
                const newMessages = [...group.messages, message];
                return {...group, messages:newMessages}
            } else {
                return group;
            }
        }));
    }

    const groups = chatData.map( group => {return {name:group.groupName, id:group.id}});
    
    const displayMessages = () => {
        for(let i = 0; i < chatData.length; i++){
            if(chatData[i].id === selectedGroup){
                return chatData[i].messages; 
            }
        }
    }

    //Closes all socket connections
    const closeSockets = () => {
        socket.close('chat message');
    }

    return(
        <div className='ChatPage'>
            <Navbar username={username} history={history} setUserData={setUserData} closeSockets={closeSockets} />
            <div className='flex-container'>
                <Groups groups={groups} setGroup={setSelectedGroup} />
                <ChatRoom messages={displayMessages()} newMessage={newMessage} key={uuid()} />
            </div>
        </div>
    );
}

export default Chat