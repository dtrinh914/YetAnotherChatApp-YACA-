import React, {useEffect, useState} from 'react';
import {Switch, Route, useHistory} from 'react-router-dom';
import LoginPage from './views/LoginPage';
import CreateAccountPage from './views/CreateAccountPage';
import ChatPage from './views/ChatPage';
import axios from 'axios';
import './App.css';
import { ChatProvider } from './contexts/chatContext';
import { NavProvider} from './contexts/navContext';

function App() {
  const [loggedIn, setLoggedIn] = useState({loggedIn:false});
  const history = useHistory();

  const logInUser = (username,password) => {
    axios.post('/api/actions/login', {
                                        username:username,
                                        password:password,
                                        withCredentials:true
                                     })
        .then( response => {
            if(response.data.loggedIn){
                setLoggedIn(response.data);
                history.push('/chat');
            }
        }) 
        .catch( error => console.log(error));
  };

  useEffect(() =>{
    axios.get('/api/actions/loggedon', {withCredentials:true})
      .then( res => setLoggedIn(res.data) )
      .catch( err => console.log(err) );
  }, [])

  return (
    <Switch>
      <Route exact path = '/'>
        <LoginPage {...loggedIn} setLoggedIn={setLoggedIn} logInUser={logInUser} />
      </Route>
      <Route exact path = '/chat'>
        <ChatProvider>
        <NavProvider>
          <ChatPage {...loggedIn}  setLoggedIn={setLoggedIn} />
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
