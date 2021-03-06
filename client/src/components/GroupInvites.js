import React from 'react';
import GroupInviteItem from './GroupInviteItem';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    root:{
        padding: '10px 0px',
        textAlign: 'center',
        margin: 0
    },
    headerText:{
        fontWeight: 700,
    },
    list:{
        padding: 0,
        margin: 0,
    }
});

export default function GroupInvites({pendingInvites, acceptInvite, declineInvite}) {
    const classes = useStyles();

    return (
        <div className={classes.root} aria-label='group-invites'>
            <Typography className={classes.headerText}>Pending Invites</Typography>
            <List data-testid='group-invites-list' className={classes.list}>
                {pendingInvites ? pendingInvites.map(group => <GroupInviteItem key={group._id}
                                                                groupName={group.groupName}
                                                                groupId={group._id} 
                                                                acceptInvite={acceptInvite} 
                                                                declineInvite={declineInvite}/>) : ''}
            </List>
        </div>
    )
}
