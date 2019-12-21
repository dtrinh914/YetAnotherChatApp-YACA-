import React from 'react';
import {Switch, Route} from 'react-router-dom';
import LoginPage from './views/LoginPage';
import CreateAccountPage from './views/CreateAccountPage';
import ChatRoom from './views/ChatRoom';
import './App.css';

function App() {
  return (
    <Switch>
      <Route exact path = '/'><LoginPage /></Route>
      <Route exact path = '/chat'><ChatRoom /></Route>
      <Route exact path = '/users/new'><CreateAccountPage /></Route>
    </Switch>
  );
}

export default App;
