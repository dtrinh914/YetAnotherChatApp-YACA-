import React, {useContext} from 'react';
import Groups from './Groups';
import UserCard from './UserCard';
import GroupInvites from './GroupInvites'
import Divider from '@material-ui/core/Divider';
import {makeStyles} from '@material-ui/styles';
import {ChatContext} from '../contexts/chatContext';
import axios from 'axios';


const useStyles = makeStyles({
    root:{
        width: '250px',
        height: '100%',
        border: 'none',
        background:'#424242', 
    },
    paper:{
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        color: 'white',
        overflow: 'auto'
    },
    divider:{
        width: '85%',
        backgroundColor: '#616161'
    }
});


export default function LeftNav({joinRoom,updateMembers}) {
    const {chatData, chatDispatch} = useContext(ChatContext);
    const classes = useStyles();
    const username = chatData.user.username;
    const pendingInvites = chatData.user.groupInvites;

    const acceptInvite = async (groupId) => {
        try{
            //send request to update user data in backend
            let res = await axios.post('/api/users/pendinginvites/' + groupId, {withCredentials:true})
            // if successful, fetch new group data
            if (res.data.status === 1){
                res = await axios.get('/api/groups/' + groupId, {withCredentials:true});
                if(res.data.status === 1){
                    // add group data to state
                    chatDispatch({type:'ADD_GROUP', payload: res.data.data});
                    // remove pending invite from state
                    chatDispatch({type:'DECLINE_INVITE', id:groupId});
                    joinRoom(groupId);
                    updateMembers(groupId);
                }
            }
        } catch (err) {
            console.log(err);
        }
        
    }
    const declineInvite = (groupId) => {
        //send request to update user data in backend
        axios.delete('/api/users/pendinginvites/' + groupId, {withCredentials:true})
        .then(res => {
            //remove pending invite from state
            if(res.data.status === 1){
                chatDispatch({type:'DECLINE_INVITE', id:groupId});
                updateMembers(groupId);
            }
        })
        .catch(err => console.log(err));
    }

    return (
        <div className={classes.root}>
            <div className={classes.paper}>
                <UserCard username={username} />
                <Divider className={classes.divider} variant='middle' />
                <Groups joinRoom={joinRoom} />
                {chatData.user.groupInvites.length > 0 
                    ?   (<>
                            <Divider className={classes.divider} variant='middle' />
                            <GroupInvites pendingInvites={pendingInvites} 
                            acceptInvite={acceptInvite} 
                            declineInvite={declineInvite} />
                        </>)
                    : ''}
            </div>
        </div>
    )
}
