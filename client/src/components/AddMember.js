import React,{useState} from 'react';
import useInput from '../hooks/useInput';
import MemberResultCard from './MemberResultCard';
import {makeStyles} from '@material-ui/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import axios from 'axios';
import uuid from 'uuid/v4';


const useStyles = makeStyles({
    root:{
        display: 'flex',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 500,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.4)'
    },
    paper:{
        padding: '15px',
        textAlign: 'center',
        background: 'white',
        height: '90%',
        maxHeight: '700px',
        width: '80%',
        maxWidth: '300px',
        overflow: 'auto'
    },
});

export default function AddMember({sendInvite, filterResults, closeAddMem}) {
    const classes = useStyles();
    const [username, setUsername] = useInput();
    const [searchResults, setSearchResults] = useState([]);

    const searchUser = (name) =>{
        const url = '/api/users/search/'+ name;
        axios.get(url, {withCredentials:true})
        .then( res => {
            if(res.data.status === 1){
                setSearchResults(res.data.data);
            }
        })
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        searchUser(username);
    }

    return (
        <div className={classes.root}>
            <ClickAwayListener onClickAway={closeAddMem}>
                <Paper className={classes.paper} >
                    <Typography>Add a Member</Typography>
                    <form onSubmit={handleSubmit}>
                        <Input className={classes.input} id='username' name='username' placeholder='Username' 
                        value={username} onChange={setUsername} />
                        <List>
                            {filterResults(searchResults)
                                .map(result => <MemberResultCard key={uuid()} 
                                                                username={result.username} 
                                                                userId={result._id}
                                                                status= {result.status} 
                                                                sendInvite = {sendInvite}
                                                                />)}
                        </List>
                        <Button className={classes.button} type='submit'>Search</Button>
                    </form>
                    <Button className={classes.button} onClick={closeAddMem} >Close</Button>
                </Paper>
            </ClickAwayListener>
        </div>
    )
}
