import React,{useState} from 'react';
import useInput from '../hooks/useInput';
import MemberResultCard from './MemberResultCard';
import {makeStyles} from '@material-ui/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import LinearProgress from '@material-ui/core/LinearProgress';
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
    const [loading, setLoading] = useState(false);

    const searchUser = (name) =>{
        setLoading(true);
        const url = '/api/users/search/'+ name;
        axios.get(url, {withCredentials:true})
        .then( res => {
            if(res.data.status === 1){
                setSearchResults(res.data.data);
            }
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
        })
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if(username.trim() !== ''){
            searchUser(username);
        }
    }

    return (
        <div className={classes.root}>
            <ClickAwayListener onClickAway={closeAddMem} mouseEvent='onMouseDown'>
                <Paper className={classes.paper} >
                    {loading ? <LinearProgress /> : ''}
                    <Typography>Add a Member</Typography>
                    <form data-testid='addmember-form' onSubmit={handleSubmit}>
                        <Input inputProps={{'data-testid':'addmember-input'}} className={classes.input} id='username' 
                        name='username' placeholder='Username' value={username} onChange={setUsername} disabled={loading} />
                        <List>
                            {filterResults(searchResults)
                                .map(result => <MemberResultCard key={uuid()} 
                                                                username={result.username} 
                                                                userId={result._id}
                                                                status= {result.status} 
                                                                sendInvite = {sendInvite}
                                                                />)}
                        </List>
                        <Button data-testid='addmember-submit-button' className={classes.button} 
                            type='submit' disabled={loading}>Search</Button>
                    </form>
                    <Button className={classes.button} onClick={closeAddMem}>Close</Button>
                </Paper>
            </ClickAwayListener>
        </div>
    )
}
