import React from 'react';
import useInput from '../hooks/useInput';
import './CreateAccountPage.css'

function CreateAccountPage(){
    const [username, setUsername] = useInput();
    const [password, setPassword] = useInput();
    
    return(
        <div className='CreateAccountPage' >
            <form action='http://localhost:3000/users/new' method='POST'>
                <h1>Create an Account</h1>
                <label htmlFor="username">Username</label>
                <input type="text" name='username' id='username' value={username} onChange={setUsername} />
                <label htmlFor="password">Password</label>
                <input type="password" name='password' id='password' value={password} onChange={setPassword} />
                <button>Sign Up</button>
            </form>
        </div>
    );
}

export default CreateAccountPage; 