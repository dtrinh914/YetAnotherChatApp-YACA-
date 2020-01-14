import React, {useEffect, useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import Navbar from '../components/Navbar';
import LeftNav from '../components/LeftNav';
import RightNav from '../components/RightNav';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import axios from 'axios';
import io from 'socket.io-client';
import {ChatContext} from '../contexts/chatContext';
import {makeStyles} from '@material-ui/styles';
import { NavProvider } from '../contexts/navContext';

const useStyles = makeStyles({
    root:{
        display:'flex'
    },
    middle:{
        width: '100%'
    }
});

let socket;
function Chat({username, loggedIn, setUserData}){
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

            //on connect joins the rooms on the client side
            socket.on('connect', () => {
                chatData.groups.forEach(group => {
                    socket.emit('room', group._id)
                })
            })
        }
    }, [loaded])

    const newMessage = (message) => {
        socket.emit('message', chatData.selected._id, message);
        chatDispatch({type:'NEW_MSG', room:chatData.selected._id, message:message});
    }
    const joinRoom = (roomId) => {
        socket.emit('room', roomId)
    }

    if(loaded){
        return(
            <NavProvider>
                <div className={classes.root}>
                    <LeftNav username={username} joinRoom={joinRoom} />
                    <div className={classes.middle}>
                        <Navbar history={history} setUserData={setUserData} />
                        <div className='ChatRoom'>
                            <ChatWindow />
                            <ChatInput onConfirm={newMessage} />
                        </div>
                    </div>
                    {chatData.groups && chatData.groups.length > 0 ? <RightNav /> : ''}
                </div>
            </NavProvider>
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