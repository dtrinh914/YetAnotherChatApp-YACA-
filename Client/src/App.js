import React, {useEffect, useState} from 'react';
import {Switch, Route} from 'react-router-dom';
import LoginPage from './views/LoginPage';
import CreateAccountPage from './views/CreateAccountPage';
import ChatRoom from './views/ChatRoom';
import axios from 'axios';
import './App.css';

function App() {
  const [userData, setUserData] = useState({loggedIn:false});

  useEffect(() =>{
    axios.get('/api/users/loggedon', {withCredentials:true})
      .then( res => setUserData(res.data) )
      .catch( err => console.log(err) );
  }, [])

  return (
    <Switch>
      <Route exact path = '/' render={(props) => <LoginPage {...props} {...userData} setUserData={setUserData} />} />
      <Route exact path = '/chat' render={(props) => <ChatRoom {...props} {...userData} setUserData={setUserData} />} />
      <Route exact path = '/users/new'><CreateAccountPage /></Route>
    </Switch>
  );
}

export default App;
