import React, {useContext} from 'react';
import Paper from '@material-ui/core/Paper';
import Hidden from '@material-ui/core/Hidden';
import {makeStyles} from '@material-ui/styles';
import AddMember from './AddMember';
import {NavContext} from '../contexts/navContext';
import {ChatContext} from '../contexts/chatContext';
import axios from 'axios';

const useStyles = makeStyles({
    root:{
        display: 'flex',
        flexDirection: 'column',
        width: '250px',
        height: '100%',
        border: 'none',
        background:'#424242',
        color: 'white',
        overflow: 'auto'
    },
    divider:{
        width: '85%',
        backgroundColor: '#616161'
    }
});


export default function RightNav({updateInvite, updateMembers}) {
    const {navData} = useContext(NavContext);
    const {chatData, chatDispatch} = useContext(ChatContext);
    const classes = useStyles();
    const addMemStatus = navData.rightNav.addMem;

    const selectedGroupId = chatData.selected._id;
    const currUserId = chatData.user._id;
    const {activeMembers, pendingMembers, pendingRequests} = chatData.groups[chatData.selected.index];

    const sendInvite = (userId) =>{
        axios.post('/api/groups/' + selectedGroupId + '/members',{userId: userId, 
            withCredentials:true})
            .then(res => {
                if(res.data.status === 1){
                    chatDispatch({type:'ADD_MEMBER', groupId:selectedGroupId, memberId: userId});
                    updateInvite(userId);
                    updateMembers(selectedGroupId);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    //filter the search results based on if the user is the current user, already a member,
    //or has a pending invite
    const filterResults = (results) => {
        let filtered = [];
        
        for(let i = 0; i < results.length; i++){
            let current = results[i];
            if(current._id === currUserId){
                continue;
            }
            //check if current user is an active member 
            //and creates a key 'status' set to 'active' for the user object
            if(activeMembers.includes(current._id)){
                current['status'] = 'active';
            }
            //check if current user had a pending request for the group
            else if(pendingMembers.includes(current._id) || pendingRequests.includes(current._id)){
                current['status'] = 'pending';
            } else {
                current['status'] = 'add';
            }
            filtered.push(current)
        }
        return filtered;
    }


    return (
        <Hidden smDown >
            <Paper className={classes.root} square>
                <AddMember open={addMemStatus} sendInvite={sendInvite} filterResults={filterResults} />
            </Paper>
        </Hidden>
    )
}
