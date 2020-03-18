import React, {useEffect, useState} from 'react';
import {Switch, Route, useHistory} from 'react-router-dom';
import LoginPage from './views/LoginPage';
import CreateAccountPage from './views/CreateAccountPage';
import ChatPage from './views/ChatPage';
import LandingPage from './views/LandingPage';
import axios from 'axios';
import io from 'socket.io-client';
import './App.css';
import { ChatProvider } from './contexts/chatContext';
import { NavProvider} from './contexts/navContext';


function App() {
  const [loggedIn, setLoggedIn] = useState({loggedIn:false});
  const history = useHistory();

  const logInUser = async (username, password) => {
    try{
      const response = await axios.post('/api/actions/login', {
                                                                username:username,
                                                                password:password,
                                                                withCredentials:true
                                                              });
      if(response.data.loggedIn){
        setLoggedIn(response.data);
        history.push('/chat');
      } else {
        return 0;
      }
    } catch (err){
      console.log(err);
    }
  };

  useEffect(() =>{
    axios.get('/api/actions/loggedon', {withCredentials:true})
      .then( res => setLoggedIn(res.data) )
      .catch( err => console.log(err) );
  }, [])

  return (
    <Switch>
      <Route exact path = '/'>
        <LandingPage {...loggedIn} />
      </Route>
      <Route exact path = '/login'>
        <LoginPage setLoggedIn={setLoggedIn} />
      </Route>
      <Route exact path = '/chat'>
        <ChatProvider>
        <NavProvider>
          <ChatPage io={io} {...loggedIn}  setLoggedIn={setLoggedIn} />
        </NavProvider>
        </ChatProvider>
      </Route>
      <Route exact path = '/users/new'>
        <CreateAccountPage logInUser={logInUser} />
      </Route>
    </Switch>
  );
}

export default App;
