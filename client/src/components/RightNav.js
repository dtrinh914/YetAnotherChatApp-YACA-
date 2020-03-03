import React, {useContext} from 'react';
import AddMember from './AddMember';
import GroupDescription from './GroupDescription';
import GroupMembers from './GroupMembers';
import GroupSettingsForm from './GroupSettingsForm';
import ConfirmationWindow from './ConfirmationWindow';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import {makeStyles} from '@material-ui/styles';
import {NavContext} from '../contexts/navContext';
import {ChatContext} from '../contexts/chatContext';
import axios from 'axios';




const useStyles = makeStyles({
    root:{
        width: '250px',
        height: '100%',
        background:'#424242',
        overflow: 'auto',
        wordWrap: 'break-word'
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


export default function RightNav({updateInvite, updateMembers, updateGroup, removeGroup, removeUsers, leaveRoom, currentGroup, currUserId}) {
    const {navData, navDispatch} = useContext(NavContext);
    const {chatDispatch} = useContext(ChatContext);
    const classes = useStyles();
    const addMemStatus = navData.rightNav.addMem;
    const groupSettingsStatus = navData.rightNav.groupSettings;
    const leaveGroupStatus = navData.rightNav.leaveGroup;
    const groupDescription = currentGroup.description;

    const selectedGroupId = currentGroup._id;
    const {activeMembers, pendingMembers, pendingRequests, creator} = currentGroup;
    const leaveGroupText = `Are you sure you want to leave ${currentGroup.groupName}?`

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
    };

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
    };

    const editGroup = (groupDescription) => {
        axios.put(`api/groups/${selectedGroupId}`, {groupDescription: groupDescription, withCredentials:true})
             .then( res => {
                if(res.data.status === 1){
                    updateGroup(selectedGroupId, groupDescription)
                    chatDispatch({type:'UPDATE_GROUP', groupId:selectedGroupId, groupDescription: groupDescription});
                }
             })
             .catch(err => console.log(err));
    }

    const deleteGroup = () => {
        axios.delete(`api/groups/${selectedGroupId}`, {withCredentials:true})
             .then( res => {
                 if(res.data.status === 1){
                    //send message to clients in group via socket connection
                    removeGroup(selectedGroupId);
                    chatDispatch({type:'REMOVE_GROUP', groupId:selectedGroupId});
                    //close menu
                    closeGroupSettings();
                 }
             })
             .catch(err => console.log(err))
    }

    const deleteMembers = (userIds) => {
        axios.delete(`api/groups/${selectedGroupId}/members`, {data:{userIds:userIds}, withCredentials:true})
             .then(res => {
                if(res.data.status === 1){
                    updateMembers(selectedGroupId);
                    removeUsers(userIds, selectedGroupId);
                    closeGroupSettings();
                }
             })
             .catch(err => console.log(err));
    }
    
    const closeAddMem = () => {
        navDispatch({type:'ADDMEM', open:false});
    };

    const closeGroupSettings = () => {
        navDispatch({type:'GROUPSETTINGS', open:false});
    };

    const closeLeaveGroup = () => {
        navDispatch({type:'LEAVEGROUP',  open:false});
    }

    const handleLeaveGroup = () => {
        axios.delete(`api/groups/${selectedGroupId}/members/leave`, {withCredentials:true})
             .then(res => {
                if(res.data.status === 1){
                    updateMembers(selectedGroupId);
                    leaveRoom(selectedGroupId);
                    chatDispatch({type:'REMOVE_GROUP', groupId:selectedGroupId});
                    closeLeaveGroup();
                }
             })
             .catch(err => console.log(err));
    }
    
    const handleClickAway = () => {
        navDispatch({type:'RIGHTDRAWER', open:false});
    };

    const rightNav = <div className={classes.paper}>
                        <GroupDescription description={groupDescription} />
                        <Divider className={classes.divider} variant='middle' />
                        <GroupMembers groupMembers={activeMembers} />
                     </div>
    return (
        <>
            <Hidden smDown >
                <div data-testid='right-nav' className={navData.rightNav.root ? classes.root : classes.hidden}>
                    {rightNav}
                </div>
            </Hidden>
            <Hidden mdUp>
                <Drawer open={navData.rightNav.drawer} anchor='right' ModalProps={{onBackdropClick: handleClickAway }}>
                    <div data-testid='right-nav-drawer' className={classes.root}>
                        {rightNav}
                    </div>
                </Drawer>
            </Hidden>
            {addMemStatus ? 
                <AddMember closeAddMem={closeAddMem} sendInvite={sendInvite}
                filterResults={filterResults}/> : ''}
            {groupSettingsStatus ? <GroupSettingsForm editGroup={editGroup} deleteGroup={deleteGroup} groupMembers={activeMembers}
                                        deleteMembers={deleteMembers} creator={creator} 
                                        groupName={currentGroup.groupName} groupDescription={groupDescription} 
                                        close={closeGroupSettings} /> : ''}
            {leaveGroupStatus ? <ConfirmationWindow text={leaveGroupText} handleConfirm={handleLeaveGroup} handleClose={closeLeaveGroup} /> : ''}
        </>
    )
}
