import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import format from 'date-fns/format';

const useStyle = makeStyles({
    root:{
        alignItems: 'start'
    },
    avatar:{
        margin: '0 15px'
    },
    span:{
        marginLeft: '10px'
    }
});

function Message({message}){
    const classes = useStyle();
    const date = new Date(message.time);

    return(
        <ListItem className={classes.root} data-testid='message'>
            <Avatar className={classes.avatar}>{message.username[0].toUpperCase()}</Avatar>
            <div>
                <Typography data-testid='username-time'>
                    <strong>{message.username}</strong>
                    <span className={classes.span}>{format(date, 'hh:mm aa')}</span>
                </Typography>
                <Typography data-testid='text-field'>{message.text}</Typography>
            </div>
        </ListItem>
    );
}


export default Message;