import React, {useContext} from 'react';
import AddMember from './AddMember';
import GroupDescription from './GroupDescription';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import {makeStyles} from '@material-ui/styles';
import {NavContext} from '../contexts/navContext';
import {ChatContext} from '../contexts/chatContext';
import axios from 'axios';
import GroupMembers from './GroupMembers';


const useStyles = makeStyles({
    root:{
        width: '250px',
        height: '100%',
        background:'#424242',
        overflow: 'auto'
    },
    hidden:{
        display:'none'
    },
    paper:{
        display: 'flex',
        flexDirection: 'column',
        padding: '15px',
        textAlign: 'center',
        border: 'none',
        color: 'white'
    },
    divider:{
        width: '85%',
        backgroundColor: '#616161'
    }
});


export default function RightNav({updateInvite, updateMembers}) {
    const {navData, navDispatch} = useContext(NavContext);
    const {chatData, chatDispatch} = useContext(ChatContext);
    const classes = useStyles();
    const addMemStatus = navData.rightNav.addMem;

    const groupIndex = chatData.selected.index;
    const selectedGroupId = chatData.selected._id;
    const currUserId = chatData.user._id;
    const groupDescription = chatData.groups[groupIndex].description;
    const groupMembers = chatData.groups[groupIndex].activeMembers;
    const {activeMembers, pendingMembers, pendingRequests} = chatData.groups[groupIndex];

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
        let activeMembersId = activeMembers.map( member => member._id)
        for(let i = 0; i < results.length; i++){
            let current = results[i];
            if(current._id === currUserId){
                continue;
            }
            //check if current user is an active member 
            //and creates a key 'status' set to 'active' for the user object
            if(activeMembersId.includes(current._id)){
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
    
    const closeAddMem = () => {
        navDispatch({type:'ADDMEM', open:false});
    }
    
    const handleClickAway = () => {
        navDispatch({type:'RIGHTDRAWER', open:false});
    }

    const rightNav = <div className={classes.paper}>
                        <GroupDescription description={groupDescription} />
                        <Divider className={classes.divider} variant='middle' />
                        <GroupMembers groupMembers={groupMembers} />
                     </div>
    return (
        <>
            <Hidden smDown >
                <div className={navData.rightNav.root ? classes.root : classes.hidden}>
                    {rightNav}
                </div>
            </Hidden>
            <Hidden mdUp>
                <Drawer open={navData.rightNav.drawer} anchor='right' ModalProps={{ onBackdropClick: handleClickAway }}>
                    <div className={classes.root}>
                        {rightNav}
                    </div>
                </Drawer>
            </Hidden>
            {addMemStatus ? 
                <AddMember closeAddMem={closeAddMem} sendInvite={sendInvite} 
                filterResults={filterResults}/> : ''}
        </>
    )
}
