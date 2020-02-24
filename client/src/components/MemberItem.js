import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import {makeStyles} from '@material-ui/styles';

const useStyle = makeStyles({
    avatar:{
        fontSize: '0.9rem',
        width: '20px',
        height: '20px',
        marginRight: '10px'
    },
    user:{
        display:'flex'
    },
});

export default function MemberItem({username}) {
    const classes = useStyle();
    
    return (
        <div className={classes.user}>
            <Avatar className={classes.avatar}>{username[0].toUpperCase()}</Avatar>
            <span>{username}</span>
        </div>
    )
}
