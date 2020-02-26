import React from 'react';
import useInput from '../hooks/useInput';
import {Link, Redirect} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './LoginPage.css'

function LoginPage({loggedIn, logInUser}){
    const [username, setUsername] = useInput();
    const [password, setPassword] = useInput();

    const handleSubmit = (e) => {
        e.preventDefault();
        logInUser(username, password);
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