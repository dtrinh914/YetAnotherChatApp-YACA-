import React, {useContext} from 'react';
import Groups from './Groups';
import UserCard from './UserCard';
import Paper from '@material-ui/core/Paper';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import {makeStyles} from '@material-ui/styles';
import {ChatContext} from '../contexts/chatContext';

const useStyles = makeStyles({
    paper:{
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        background:'#424242',
        height: '100vh',
        color: 'white',
        overflow: 'auto'
    },
    divider:{
        width: '85%',
        backgroundColor: '#616161'
    }
});


export default function LeftMenu() {
    const {chatData} = useContext(ChatContext);
    const classes = useStyles();
    const username = chatData.user.username;

    return (
        <Hidden smDown >
            <Paper className={classes.paper} variant='outlined'  square>
                <UserCard username={username} />
                <Divider className={classes.divider} variant='middle' />
                <Groups />
                <Divider className={classes.divider} variant='middle' />
            </Paper>
        </Hidden>
    )
}
