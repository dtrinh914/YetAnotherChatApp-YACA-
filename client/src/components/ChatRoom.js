import React from 'react';
import Navbar from './Navbar';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import RightNav from './RightNav';
import {makeStyles} from '@material-ui/styles';


const useStyles = makeStyles({
    root:{
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column'
    }
});


export default function ChatRoom({newMessage, currentGroup, selected, updateInvite, updateGroup, updateMembers, history, setLoggedIn, userInfo, removeGroup}) {
    const classes = useStyles();
    const isCreator = currentGroup.creator === userInfo._id ? true : false;
    const isAdmin = currentGroup.admins.includes(userInfo._id) ? true : false; 
    return (
        <>
           <div className={classes.root}>
                <Navbar history={history} setLoggedIn={setLoggedIn} isCreator={isCreator} isAdmin={isAdmin} />
                <ChatWindow messages={currentGroup.messages} memberMap={currentGroup.memberMap} />
                <ChatInput onConfirm={newMessage} selected={selected} />
            </div>
            <RightNav currUserId={userInfo._id} currentGroup={currentGroup} updateInvite={updateInvite} 
                updateGroup={updateGroup} removeGroup={removeGroup} updateMembers={updateMembers} />
        </>
    )
}
