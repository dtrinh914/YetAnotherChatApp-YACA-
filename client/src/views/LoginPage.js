import React from 'react';
import useInput from '../hooks/useInput';
import {Link, Redirect, useHistory} from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css'

function LoginPage({loggedIn, setUserData}){
    const [username, setUsername] = useInput();
    const [password, setPassword] = useInput();
    let history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/users/login', {
            username:username,
            password:password,
            withCredentials:true
        })
        .then( response => {
            if(response.data.loggedIn){
                setUserData(response.data);
                history.push('/chat');
            }
        }) 
        .catch( error => console.log(error));
    }

    if(loggedIn){
        return <Redirect to='/chat' />
    } else {
        return(
            <div className='LoginPage' >
                <form onSubmit={handleSubmit}>
                    <h1>Sign In</h1>
                    <label htmlFor="username">Username</label>
                    <input type="text" name='username' id='username' value={username} onChange={setUsername} />
                    <label htmlFor="password">Password</label>
                    <input type="password" name='password' id='password' value={password} onChange={setPassword} />
                    <button>Login</button>
                    <Link to='/users/new'>Create User</Link>
                </form>
            </div>
        );
    }
}

export default LoginPage; 