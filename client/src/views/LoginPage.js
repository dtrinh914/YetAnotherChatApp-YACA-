import React from 'react';
import useInput from '../hooks/useInput';
import {Link, Redirect, useHistory} from 'react-router-dom';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
                    <TextField className='sign-in' type='text' name='username' id='username' 
                    label='Username' variant='outlined' value={username} 
                    onChange={setUsername} />
                    <TextField className='sign-in' type="password" name='password' id='password' 
                    label='Password' variant='outlined' value={password} 
                    onChange={setPassword} />
                    <Button type='submit' variant="outlined">Login</Button>
                    <Link to='/users/new'>Create User</Link>
                </form>
            </div>
        );
    }
}

export default LoginPage; 