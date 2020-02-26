import React, {useEffect, useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import LeftNav from '../components/LeftNav';
import ChatRoom from '../components/ChatRoom';
import Welcome from '../components/Welcome';
import axios from 'axios';
import io from 'socket.io-client';
import {ChatContext} from '../contexts/chatContext';
import {NavContext} from '../contexts/navContext';
import {makeStyles} from '@material-ui/styles';


const useStyles = makeStyles({
    root:{
        display:'flex',
        height: '100vh',
        width: '100vw'
    },
});

let socket;

function Chat({loggedIn, setLoggedIn}){
    const classes = useStyles();
    const history = useHistory();
    const {navDispatch} = useContext(NavContext);
    const {chatData, chatDispatch} = useContext(ChatContext);
    const [loaded, setLoaded] = useState(false);

    const handleLogOut = () => {
        axios.get('/api/actions/logout', {withCredentials:true})
        .then(res => {
            if(res.data.loggedIn === false){
                setLoggedIn(res.data);
                socket.emit('closeClient', chatData.user._id);
                history.push('/');
                
            }
        })
        .catch((err) => console.log(err));
    };

    useEffect(() => {
        //redirect if user is not logged in
        if(!loggedIn){
            history.push('/');
        } else {
            //fetch current chat data from DB
            axios.get('/api/actions/data', {withCredentials:true})
            .then(res => {
                chatDispatch({type:'INIT', payload: res.data})
                setLoaded(true);
            }) 
        }
    }, [history, loggedIn, chatDispatch]);

    useEffect(() => {
        if(loaded){
            socket = io();
            //listens for new messages from the backend and updates state
            socket.on('message', (room, message) => {
                chatDispatch({type:'NEW_MSG', room:room, message:message})
            });

            //listener to update pending list
            socket.on('update_pendinglist', ()=> {
                axios.get('/api/users/pendinginvites', {withCredentials:true})
                .then(res => {
                    if(res.data.status === 1){
                        chatDispatch({type:'UPDATE_PENDING', payload:res.data.data}) 
                    }
                })
                .catch(err => console.log(err)); 
            });

            //listener to update member list
            socket.on('update_memberlist', (groupId) => {
                axios.get('/api/groups/'+ groupId + '/members', {withCredentials:true})
                .then(res => {
                    if(res.data.status === 1){
                        chatDispatch({type:'UPDATE_MEMBERS', groupId:groupId, payload:res.data.data}) ;
                    }
                })
                .catch(err => console.log(err)); 
            });

            //listener to update group data
            socket.on('update_group', (groupId, groupDescription) => {
                chatDispatch({type:'UPDATE_GROUP', groupId:groupId, groupDescription: groupDescription});
            });

            //listener to remove group
            socket.on('remove_group', (groupId) => {
                socket.emit('leave_room', groupId);
                chatDispatch({type:'REMOVE_GROUP', groupId:groupId});
            });

            //on connect joins the rooms on the client side
            socket.on('connect', () => {
                chatData.groups.forEach(group => {
                    socket.emit('join_room', group._id);
                })
                socket.emit('user', chatData.user._id);
            });

            socket.on('closeClient', ()=>{
                handleLogOut();
            })
        }
        //eslint-disable-next-line
    }, [loaded])

    const newMessage = (text) => {
        const message = {id: chatData.user._id, text: text, time: new Date()}
        socket.emit('message', chatData.selected._id, message);
        chatDispatch({type:'NEW_MSG', room:chatData.selected._id, message:message});
    }
    const joinRoom = (roomId) => {
        socket.emit('join_room', roomId)
    }
    const updateInvite = (userId) => {
        socket.emit('update_pendinglist', userId);
    }
    const updateMembers = (groupId) => {
        socket.emit('update_memberlist', groupId);
    }

    const updateGroup = (groupId, groupDescription) => {
        socket.emit('update_group', groupId, groupDescription)
    }

    const removeGroup = (groupId) => {
        socket.emit('remove_group', groupId);
    }

    const openNewGroup = () => {
        navDispatch({type:'NEWGROUP', open:true});
        navDispatch({type:'LEFTDRAWER', open: false});
    }

    const removeUsers = (userIds, groupId) => {
        socket.emit('remove_users', userIds, groupId);
    }

    const leaveRoom = (groupId) => {
        socket.emit('leave_room', groupId);
    }

    if(loaded){
        return(
            <div className={classes.root}>
                <LeftNav userData={chatData.user} groupData={chatData.groups} joinRoom={joinRoom} updateMembers={updateMembers} />
                {chatData.groups.length > 0 ? 
                    <ChatRoom currentGroup={chatData.groups[chatData.selected.index]} userInfo={chatData.user}
                    newMessage={newMessage} updateMembers={updateMembers} removeUsers={removeUsers} selected={chatData.selected}
                    updateGroup={updateGroup} removeGroup={removeGroup} leaveRoom={leaveRoom} 
                    updateInvite={updateInvite} handleLogOut={handleLogOut} /> 
                    : <Welcome handleLogOut={handleLogOut} openNewGroup={openNewGroup} />}
            </div>
        );
    } else {
        return(
            <div>
                <h1>Loading</h1>
            </div>
        )
    }
    
}

export default Chat