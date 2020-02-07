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

export default function ChatRoom({newMessage, currentGroup, selected, updateInvite, updateMembers, history, setUserData, userInfo}) {
    const classes = useStyles();
    return (
        <>
           <div className={classes.root}>
                <Navbar history={history} setUserData={setUserData} />
                <ChatWindow messages={currentGroup.messages} memberMap={currentGroup.memberMap} />
                <ChatInput onConfirm={newMessage} selected={selected} />
            </div>
            <RightNav userID={userInfo._id} currentGroup={currentGroup} updateInvite={updateInvite} updateMembers={updateMembers} />
        </>
    )
}
