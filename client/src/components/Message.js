import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import {makeStyles} from '@material-ui/core/styles';

const useStyle = makeStyles({
    avatar:{
        marginRight: '10px'
    },
    span:{
        marginLeft: '10px'
    }
});

function Message({message}){
    const classes = useStyle();
    const date = new Date(message.time);

    return(
        <ListItem>
            <Avatar className={classes.avatar}>{message.username[0].toUpperCase()}</Avatar>
            <div>
                <p><strong>{message.username}</strong><span className={classes.span}>{date.toString()}</span></p>
                {message.text} 
            </div>
        </ListItem>
    );
}


export default Message;