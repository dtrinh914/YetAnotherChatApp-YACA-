import React,{useState} from 'react';
import useInput from '../hooks/useInput';
import MemberResultCard from './MemberResultCard';
import {makeStyles} from '@material-ui/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import axios from 'axios'
import uuid from 'uuid/v4'


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

export default function AddMember({currUserId,activeMembers, pendingMembers, pendingRequests, selectedGroupId, open}) {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        searchUser(username);
    }
    const sendInvite = (userId) =>{
        axios.post('/api/groups/' + selectedGroupId + '/members',{userId: userId, 
            withCredentials:true})
            .then(res => {
                console.log(res);
            })
    }

    //filter the search results based on if the user is the current user, already a member,
    //or has a pending invite
    const filterResults = (results) => {
        let filtered = [];
        for(let i = 0; i < results.length; i++){
            let current = results[i];
            if(current._id === currUserId){
                continue;
            }
            
            //check if current user is an active member 
            //and creates a key 'status' set to 'active' for the user object
            if(activeMembers.includes(current._id)){
                current['status'] = 'active';
            }
            //check if current user had a pending request for the group
            else if(pendingMembers.includes(current._id) || pendingRequests.includes(current._id)){
                current['status'] = 'pending';
            } else {
                current['status'] = 'add';
            }
            filtered.push(current)
        }
        return filtered;
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
