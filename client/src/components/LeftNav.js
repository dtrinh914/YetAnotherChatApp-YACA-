import React, {useContext, useEffect} from 'react';
import Groups from './Groups';
import UserCard from './UserCard';
import GroupInvites from './GroupInvites'
import Paper from '@material-ui/core/Paper';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import {makeStyles} from '@material-ui/styles';
import {ChatContext} from '../contexts/chatContext';
import axios from 'axios';

const useStyles = makeStyles({
    paper:{
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        height: '100vh',
        background:'#424242',
        color: 'white',
        overflow: 'auto'
    },
    divider:{
        width: '85%',
        backgroundColor: '#616161'
    }
});


export default function LeftNav() {
    const {chatData, chatDispatch} = useContext(ChatContext);
    const classes = useStyles();
    const username = chatData.user.username;
    const pendingInvites = chatData.user.groupInvites;

    const acceptInvite = async (groupId) => {
        try{
            let res = await axios.post('/api/users/pendinginvites/' + groupId, {withCredentials:true})
            if (res.data.status === 1){
                res = await axios.get('/api/groups/' + groupId, {withCredentials:true});
                if(res.data.status === 1){
                    chatDispatch({type:'ADD_GROUP', payload: res.data.data});
                }
            }
        } catch (err) {
            console.log(err);
        }
        
    }
    const declineInvite = (groupId) => {
        axios.delete('/api/users/pendinginvites/' + groupId, {withCredentials:true})
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }

    return (
        <Hidden smDown >
            <Paper className={classes.paper} variant='outlined'  square>
                <UserCard username={username} />
                <Divider className={classes.divider} variant='middle' />
                <Groups />
                <Divider className={classes.divider} variant='middle' />
                <GroupInvites pendingInvites={pendingInvites} 
                    acceptInvite={acceptInvite} 
                    declineInvite={declineInvite} />
                <Divider className={classes.divider} variant='middle' />
            </Paper>
        </Hidden>
    )
}
