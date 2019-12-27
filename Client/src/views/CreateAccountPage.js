import React from 'react';
import useInput from '../hooks/useInput';
import axios from 'axios';
import './CreateAccountPage.css'

function CreateAccountPage(){
    const [username, setUsername] = useInput();
    const [password, setPassword] = useInput();

    const handleSubmit = (e) =>{
        e.preventDefault()
        axios.post('/api/users/new', {
            username:username, 
            password:password, 
            withCredentials:true
        })
        .then( res => {
            console.log(res);
        })
    }
    
    return(
        <div className='CreateAccountPage' >
            <form onSubmit={handleSubmit}>
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