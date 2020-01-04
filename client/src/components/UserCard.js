import React from 'react'
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    root:{
        padding: '20px 0px',
        textAlign: 'center',
        alignSelf: 'center'
    },
    avatar:{
        marginBottom: '10px'
    }
});

export default function UserCard({username}) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Avatar className={classes.avatar}>{username[0].toUpperCase()}</Avatar>
            <Typography>{username}</Typography>
        </div>
    )
}
