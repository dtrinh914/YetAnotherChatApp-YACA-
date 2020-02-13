import React, {useEffect, useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import LeftNav from '../components/LeftNav';
import ChatRoom from '../components/ChatRoom';
import axios from 'axios';
import io from 'socket.io-client';
import {ChatContext} from '../contexts/chatContext';
import {makeStyles} from '@material-ui/styles';


const useStyles = makeStyles({
    root:{
        display:'flex',
        height: '100vh',
        width: '100vw'
    },
    middle:{
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column'
    }
});

let socket;

function Chat({loggedIn, setUserData}){
    const classes = useStyles();
    const history = useHistory();
    const {chatData, chatDispatch} = useContext(ChatContext);
    const [loaded, setLoaded] = useState(false);

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
                    console.log(res);
                    if(res.data.status === 1){
                        chatDispatch({type:'UPDATE_MEMBERS', groupId:groupId, payload:res.data.data}) 
                    }
                })
                .catch(err => console.log(err)); 
            });

            //on connect joins the rooms on the client side
            socket.on('connect', () => {
                chatData.groups.forEach(group => {
                    socket.emit('room', group._id)
                })
                socket.emit('user', chatData.user._id)
            })

            return function cleanup(){
                socket.close();
            }
        }
        //eslint-disable-next-line
    }, [loaded])

    const newMessage = (text) => {
        const message = {id: chatData.user._id, text: text, time: new Date()}
        socket.emit('message', chatData.selected._id, message);
        chatDispatch({type:'NEW_MSG', room:chatData.selected._id, message:message});
    }
    const joinRoom = (roomId) => {
        socket.emit('room', roomId)
    }
    const updateInvite = (userId) => {
        socket.emit('update_pendinglist', userId);
    }
    const updateMembers = (groupId) => {
        socket.emit('update_memberlist', groupId);
    }

    if(loaded){
        return(
            <div className={classes.root}>
                <LeftNav userData={chatData.user} groupData={chatData.groups} joinRoom={joinRoom} updateMembers={updateMembers} />
                {chatData.groups.length > 0 ? 
                    <ChatRoom currentGroup={chatData.groups[chatData.selected.index]} userInfo={chatData.user}
                    newMessage={newMessage} updateMembers={updateMembers} selected={chatData.selected}
                    updateInvite={updateInvite} history={history} setLoggedIn={setLoggedIn} /> : ''}
                
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