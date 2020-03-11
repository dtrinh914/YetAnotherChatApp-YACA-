import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import StatusBadge from './StatusBadge';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    list:{
        margin: 0
    },
    avatar:{
        marginRight: '10px'
    }
})

export default function GroupMembers({groupMembers}) {
    const classes = useStyles();
    return (
        <div>
            <h2>Group Members</h2>
            <List className={classes.list}>
                {groupMembers.map(member => <ListItem key={member._id} data-testid='group-member'>
                                                <Avatar className={classes.avatar}>
                                                    {member.username[0].toUpperCase()}
                                                </Avatar>
                                                <StatusBadge online={true} />
                                                <span>{member.username}</span>
                                            </ListItem>)}
            </List>
        </div>
    )
}
