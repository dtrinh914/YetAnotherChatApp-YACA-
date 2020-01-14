import React, {useEffect, useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import Navbar from '../components/Navbar';
import LeftNav from '../components/LeftNav';
import RightNav from '../components/RightNav';
import ChatRoom from '../components/ChatRoom';
import axios from 'axios';
import {ChatContext} from '../contexts/chatContext';
import {makeStyles} from '@material-ui/styles';
import { NavProvider } from '../contexts/navContext';

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
    const {chatDispatch} = useContext(ChatContext);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        //redirect if user is not logged in
        if(!loggedIn){
            history.push('/');
        } else {
            //fetch current chat data from DB
            axios.get('/api/actions/data', {withCredentials:true})
            .then(res => {
                chatDispatch({type:'INIT', payload: res.data})
                setLoaded(true);
            }) 
        }
    }, [history, loggedIn, chatDispatch]);

    if(loaded){
        return(
            <NavProvider>
                <div className={classes.root}>
                    <LeftNav username={username} />
                    <div className={classes.middle}>
                        <Navbar history={history} setUserData={setUserData} />
                        <ChatRoom />
                    </div>
                    <RightNav />
                </div>
            </NavProvider>
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