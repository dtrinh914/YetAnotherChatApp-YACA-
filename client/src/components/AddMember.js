import React,{useState, useEffect} from 'react';
import useInput from '../hooks/useInput';
import MemberResultCard from './MemberResultCard';
import {makeStyles} from '@material-ui/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import axios from 'axios';
import uuid from 'uuid/v4';


const useStyles = makeStyles({
    rootActive:{
        textAlign: 'center',
        color:'white',
        background: 'none'
    },
    rootHidden:{
        display: 'none'
    },
    button:{
        color:'white'
    },
    input: {
        color:'white',
    }
});

export default function AddMember({open, sendInvite, filterResults}) {
    const classes = useStyles();
    const [username, setUsername, resetUsername] = useInput();
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

    useEffect(()=>{
        resetUsername();
        //eslint-disable-next-line
    },[open]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        searchUser(username);
    }

    return (
        <Paper className={open ? classes.rootActive:classes.rootHidden} square>
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
        </Paper>
    )
}
