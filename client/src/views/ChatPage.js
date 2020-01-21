import React, {useEffect, useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import Navbar from '../components/Navbar';
import LeftNav from '../components/LeftNav';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import RightNav from '../components/RightNav';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import axios from 'axios';
import io from 'socket.io-client';
import {ChatContext} from '../contexts/chatContext';
import {makeStyles} from '@material-ui/styles';
import {NavContext} from '../contexts/navContext';


const useStyles = makeStyles({
    root:{
        display:'flex',
        height: '100vh'
    },
    drawer:{
        width: '300px'
    },
    middle:{
        display: 'flex',
        flexDirection: 'column',
        flexGrow:'1'
    }
});

let socket;
function Chat({username, loggedIn, setUserData}){
    const classes = useStyles();
    const history = useHistory();
    const {chatData, chatDispatch} = useContext(ChatContext);
    const {navData, navDispatch} = useContext(NavContext);
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
        }
        //eslint-disable-next-line
    }, [loaded])

    const newMessage = (message) => {
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

    //closes left menu on clickaway
    const handleLeftClickAway = () => {
        if(!navData.leftNav.newGroup){
            navDispatch({type:'LEFTDRAWER', open:false});
        }
    }

    if(loaded){
        return(
            <div className={classes.root}>
                <Hidden xsDown>
                    <LeftNav username={username} joinRoom={joinRoom} updateMembers={updateMembers} />
                </Hidden>
                <Hidden smUp>
                    <Drawer open={navData.leftNav.drawer} ModalProps={{ onBackdropClick: handleLeftClickAway }}>
                        <LeftNav username={username} joinRoom={joinRoom} updateMembers={updateMembers} />
                    </Drawer>
                </Hidden>
                <div className={classes.middle}>
                    <Navbar history={history} setUserData={setUserData} />
                    <ChatWindow />
                    <ChatInput onConfirm={newMessage} />
                </div>
                { (chatData.groups.length > 0) ? 
                        <RightNav updateInvite={updateInvite} updateMembers={updateMembers} /> : ''}
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