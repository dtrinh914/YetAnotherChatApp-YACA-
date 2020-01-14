import React, {useContext} from 'react';
import Paper from '@material-ui/core/Paper';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import {makeStyles} from '@material-ui/styles';
import {ChatContext} from '../contexts/chatContext';
import AddMember from './AddMember';
import {NavContext} from '../contexts/navContext';

const useStyles = makeStyles({
    paperActive:{
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        height: '100vh',
        background:'#424242',
        color: 'white',
        overflow: 'auto'
    },
    paperHidden:{
        display: 'none'
    },
    divider:{
        width: '85%',
        backgroundColor: '#616161'
    }
});


export default function RightNav() {
    const {chatData} = useContext(ChatContext);
    const {navData} = useContext(NavContext);
    const classes = useStyles();

    const rightNavStatus = navData.rightNav.root;
    const addMemStatus = navData.rightNav.addMem;
    const selectedGroupId = chatData.selected._id;
    const currUserId = chatData.user._id;

    let activeMembers = [], pendingMembers = [], pendingRequests = [];
    if(chatData.groups > 0){
        const groupData = chatData.groups[chatData.selected.index];
        activeMembers = groupData.activeMembers;
        pendingMembers = groupData.pendingMembers;
        pendingRequests = groupData.pendingRequests;
    }

    return (
        <Hidden smDown >
            <Paper className={rightNavStatus ? classes.paperActive : classes.paperHidden} 
            variant='outlined'  square>
                <AddMember currUserId={currUserId} activeMembers={activeMembers} pendingMembers={pendingMembers}
                pendingRequests={pendingRequests} selectedGroupId={selectedGroupId} open={addMemStatus} />
            </Paper>
        </Hidden>
    )
}
