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

export default function ChatRoom({newMessage, currentGroup, selected, updateInvite, updateMembers, history, setLoggedIn}) {
    const classes = useStyles();
    return (
        <>
           <div className={classes.root}>
                <Navbar history={history} setLoggedIn={setLoggedIn} />
                <ChatWindow currentGroup={currentGroup} />
                <ChatInput onConfirm={newMessage} selected={selected} />
            </div>
            <RightNav currentGroup={currentGroup} updateInvite={updateInvite} updateMembers={updateMembers} />
        </>
    )
}
