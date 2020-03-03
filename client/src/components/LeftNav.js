import React, {useContext} from 'react';
import Groups from './Groups';
import UserCard from './UserCard';
import GroupInvites from './GroupInvites'
import NewGroupForm from './NewGroupForm';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import {makeStyles} from '@material-ui/styles';
import {ChatContext} from '../contexts/chatContext';
import {NavContext} from '../contexts/navContext';
import axios from 'axios';


const useStyles = makeStyles({
    root:{
        width: '250px',
        height: '100%',
        border: 'none',
        background: '#424242', 
        overflow: 'auto',
        wordWrap:'break-word'
    },
    paper:{
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        color: 'white'
    },
    divider:{
        width: '85%',
        backgroundColor: '#616161'
    }
});


export default function LeftNav({userData, groupData, joinRoom, updateMembers}) {
    const {chatDispatch} = useContext(ChatContext);
    const {navData, navDispatch} = useContext(NavContext);
    const classes = useStyles();

    //
    // GROUPS
    //

    const setGroup = (id, name, index) => {
        chatDispatch({type:'CHANGE_GROUP', selected:id, name:name, index:index});
        navDispatch({type:'LEFT', open: false});
        navDispatch({type:'LEFTDRAWER', open: false});
    }

    const groups = groupData.map( group => {return {name:group.groupName, id:group._id}});


    //
    // NEW GROUP FORM
    //

    const newGroupOpen = navData.leftNav.newGroup;
    const openNewGroup = () => {
        navDispatch({type:'NEWGROUP', open:true});
        navDispatch({type:'LEFTDRAWER', open: false});
    }
    const closeNewGroup = () => {
        navDispatch({type:'NEWGROUP', open:false});
    }

    const createNewGroup = async (newGroupName, description) => {
        const res = await axios.post('/api/groups/', {
            newGroupName:newGroupName,
            description:description,
            withCredentials:true
        })

        if(res.data.status === 1){
            const groupData = res.data.data[0];
            chatDispatch({type:'ADD_GROUP', payload: groupData});
            joinRoom(groupData._id);
            return 1;
        } else if(res.data.status === 0){
            return 0;
        } else {
            return -1;
        }  
    }

    //
    // PENDING INVITES
    //
    const username = userData.username;
    const pendingInvites = userData.groupInvites;

    const acceptInvite = async (groupId) => {
        try{
            //send request to update user data in backend
            let res = await axios.post('/api/users/pendinginvites/' + groupId, {withCredentials:true})
            // if successful, fetch new group data
            if (res.data.status === 1){
                res = await axios.get('/api/groups/' + groupId, {withCredentials:true});
                if(res.data.status === 1){
                    // add group data to state
                    chatDispatch({type:'ADD_GROUP', payload: res.data.data[0]});
                    // remove pending invite from state
                    chatDispatch({type:'DECLINE_INVITE', id:groupId});
                    joinRoom(groupId);
                    updateMembers(groupId);
                }
            }
            else if(res.data.status === 0){
                chatDispatch({type:'DECLINE_INVITE', id:groupId});
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
            else if(res.data.status === 0){
                chatDispatch({type:'DECLINE_INVITE', id:groupId});
            }
        })
        .catch(err => console.log(err));
    }

    //
    // LEFT NAV
    //

    //closes left menu on clickaway
    const handleLeftClickAway = () => {
        if(!navData.leftNav.newGroup){
            navDispatch({type:'LEFTDRAWER', open:false});
        }
    }

    const leftNav = <div className={classes.root} data-testid='left-nav'>
                        <div className={classes.paper}>
                            <UserCard username={username} />
                            <Divider className={classes.divider} variant='middle' />
                            <Groups openNewGroup={openNewGroup} setGroup={setGroup} groups={groups} />
                            {userData.groupInvites.length > 0 
                                ?   (<>
                                        <Divider className={classes.divider} variant='middle' />
                                        <GroupInvites pendingInvites={pendingInvites} 
                                        acceptInvite={acceptInvite} 
                                        declineInvite={declineInvite} />
                                    </>)
                                : ''}
                        </div>
                    </div>

    return (
        <>
            <Hidden xsDown>
                {leftNav}
            </Hidden>
            <Hidden smUp>
                <Drawer open={navData.leftNav.drawer} 
                ModalProps={{ onBackdropClick: handleLeftClickAway}}
                PaperProps={{'data-testid':'left-drawer'}}>
                    {leftNav}
                </Drawer>
            </Hidden>
        
            {newGroupOpen ? <NewGroupForm createNewGroup={createNewGroup} close={closeNewGroup} /> : ''}
        </>
    )
}
