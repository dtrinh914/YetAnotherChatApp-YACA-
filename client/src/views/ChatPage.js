import React, {useEffect, useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import Navbar from '../components/Navbar';
import Groups from '../components/Groups';
import ChatRoom from '../components/ChatRoom';
import axios from 'axios';
import './ChatPage.css';
import {ChatContext} from '../contexts/chatContext'


function Chat({username, loggedIn, setUserData}){
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
                dispatch({type:"INIT", payload: res.data})
                setLoaded(true);
            }) 
        }
    }, [history, loggedIn]);

    if(loaded){
        return(
            <div className='ChatPage'>
                <Navbar username={username} history={history} setUserData={setUserData} />
                <div className='flex-container'>
                    <Groups />
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