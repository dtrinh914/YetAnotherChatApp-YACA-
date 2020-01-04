import React, {useContext} from 'react';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/styles';
import axios from 'axios';
import {ChatContext} from '../contexts/chatContext'

const useStyles=makeStyles({
    nav:{
        height: '5vh',
        display: 'flex',
        justifyContent: 'center',
    },
    tool:{
        display: 'flex',
        justifyContent: 'space-between'
    }
});

function Navbar({history, setUserData}){
    const {chatData} = useContext(ChatContext);
    const classes = useStyles();
    const handleClick = () => {
        axios.get('/api/users/logout', {withCredentials:true})
        .then(res => {
            if(res.data.loggedIn === false){
                setUserData(res.data);
                history.push('/');
            }
        })
        .catch((err) => console.log(err));
    }

    return(
        <AppBar position="static" className={classes.nav}>
            <Toolbar className={classes.tool}>
                <Typography>{chatData.selected.name}</Typography>
                <Button onClick={handleClick}>Log Out</Button>
            </Toolbar>
        </AppBar>
    )
}
export default Navbar;