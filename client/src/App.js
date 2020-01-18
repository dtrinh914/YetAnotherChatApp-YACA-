import React, {useEffect, useState} from 'react';
import {Switch, Route} from 'react-router-dom';
import LoginPage from './views/LoginPage';
import CreateAccountPage from './views/CreateAccountPage';
import ChatPage from './views/ChatPage';
import axios from 'axios';
import './App.css';
import { ChatProvider } from './contexts/chatContext';
import { NavProvider} from './contexts/navContext';

function App() {
  const [userData, setUserData] = useState({loggedIn:false});

  useEffect(() =>{
    axios.get('/api/actions/loggedon', {withCredentials:true})
      .then( res => setUserData(res.data) )
      .catch( err => console.log(err) );
  }, [])

  return (
    <Switch>
      <Route exact path = '/'>
        <LoginPage {...userData} setUserData={setUserData} />
      </Route>
      <Route exact path = '/chat'>
        <ChatProvider>
        <NavProvider>
          <ChatPage {...userData} setUserData={setUserData} />
        </NavProvider>
        </ChatProvider>
      </Route>
      <Route exact path = '/users/new'>
        <CreateAccountPage />
      </Route>
    </Switch>
  );
}

export default App;
