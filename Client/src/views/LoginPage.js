import React from 'react';
import useInput from '../hooks/useInput';
import {Link} from 'react-router-dom';
import './LoginPage.css'

function LoginPage(){
    const [username, setUsername] = useInput();
    const [password, setPassword] = useInput();
    
    return(
        <div className='LoginPage' >
            <form action='http://localhost:3000/users/login' method='POST'>
                <h1>Sign In</h1>
                <label htmlFor="username">Username</label>
                <input type="text" name='username' id='username' value={username} onChange={setUsername} />
                <label htmlFor="password">Password</label>
                <input type="password" name='password' id='password' value={password} onChange={setPassword} />
                <button>Login</button>
                <Link exact to='/users/new'>Create User</Link>
            </form>
        </div>
    );
}

export default LoginPage; 