import React, {useContext} from 'react';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import {makeStyles} from '@material-ui/styles';
import axios from 'axios';
import {ChatContext} from '../contexts/chatContext'
import {NavContext} from '../contexts/navContext';

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
    const {navDispatch} = useContext(NavContext);
    const classes = useStyles();

    const handleLogOut = () => {
        axios.get('/api/actions/logout', {withCredentials:true})
        .then(res => {
            if(res.data.loggedIn === false){
                setUserData(res.data);
                history.push('/');
            }
        })
        .catch((err) => console.log(err));
    }
    const handleAddMem = () => {
        navDispatch({type:'ADDMEM'});
    }

    return(
        <AppBar position="static" className={classes.nav}>
            <Toolbar className={classes.tool}>
                <Typography>{chatData.selected.name}</Typography>
                <IconButton onClick={handleAddMem} size='small'>
                    <PersonAddIcon />
                </IconButton>
                <Button onClick={handleLogOut}>Log Out</Button>
            </Toolbar>
        </AppBar>
    )
}
export default Navbar;