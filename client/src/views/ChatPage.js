import React, {useEffect, useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import Navbar from '../components/Navbar';
import LeftMenu from '../components/LeftMenu';
import ChatRoom from '../components/ChatRoom';
import axios from 'axios';
import {ChatContext} from '../contexts/chatContext';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    root:{
        display:'flex'
    },
    middle:{
        width: '100%'
    }
});

function Chat({username, loggedIn, setUserData}){
    const classes = useStyles();
    const history = useHistory();
    const {dispatch} = useContext(ChatContext);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        //redirect if user is not logged in
        if(!loggedIn){
            history.push('/');
        } else {
            //fetch current chat data from DB
            axios.get('/api/users/data', {withCredentials:true})
            .then(res => {
                dispatch({type:'INIT', payload: res.data})
                setLoaded(true);
            }) 
        }
    }, [history, loggedIn, dispatch]);

    if(loaded){
        return(
            <div className={classes.root}>
                <LeftMenu username={username} />
                <div className={classes.middle}>
                    <Navbar history={history} setUserData={setUserData} />
                    <ChatRoom />
                </div>
            </div>
        );
    } else {
        return(
            <div>
                <h1>Loading</h1>
            </div>
        )
    }
    
}

export default Chat