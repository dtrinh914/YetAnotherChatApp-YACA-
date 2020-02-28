import React, {useState} from 'react';
import MainPageNav from '../components/MainPageNav';
import useInput from '../hooks/useInput';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import {makeStyles} from '@material-ui/styles';

const useStyle = makeStyles({
    container:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        overflow: 'auto'
    },
    form:{
        display:'flex',
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    input:{
        marginBottom: '15px',
        minWidth: '300px'
    },
    loading: {
        position:'static',
        width: '100%'
    }
})

function CreateAccountPage({logInUser}){
    const [username, setUsername] = useInput();
    const [password, setPassword] = useInput();
    const [confirmPassword, setConfirmPassword] = useInput();
    const [inputErr, setInputErr] = useState({
                                               username:{message:'', status:false},
                                               password:{message:'', status:false},
                                               confirmPassword:{message:'', status:false}
                                            });
    const [loading, setLoading] = useState(false);
    const classes = useStyle(); 

    const verifyUsername = (username) => {
        if(username.includes(' ')){
            setInputErr({...inputErr, username: {message:'The username cannot contain any spaces.', status:true}});
        }
        else if(username.length < 3){
            setInputErr({...inputErr, username: {message:'The username needs to be at least 3 characters.', status:true}});
        }
        else if(username.length > 15){
            setInputErr({...inputErr, username: {message:'The username cannot be longer than 15 characters.', status:true}});
        } 
        else {
            setInputErr({...inputErr, username: {message:'', status: false}});
        }
    };

    const verifyConfirmPassword = (password, confirmPassword) => {
        if(password !== confirmPassword){
            setInputErr({...inputErr, confirmPassword:{message:'Passwords need to match.', status:true}});
        } else {
            setInputErr({...inputErr, confirmPassword:{message:'', status:false}})
        }
    }

    const verifyPassword = (password) => {
        if(password.includes(' ')){
            setInputErr({...inputErr, password: {message:'The password cannot contain any spaces.', status:true}});
        }
        else if(password.length < 8){
            setInputErr({...inputErr, password:{message:'The password needs to be at least 8 characters.', status: true}});
        }
        else if(password.length > 32){
            setInputErr({...inputErr, password:{message:'The password cannot be more than 32 characters.', status: true}});
        }
        else {
            setInputErr({...inputErr, password:{message:'', status: false}});
        }
    };

    

    const handleUsername = (e) => {
        setUsername(e);
        verifyUsername(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e);
        verifyPassword(e.target.value);
    }

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e);
        verifyConfirmPassword(password, e.target.value);
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        verifyUsername(username);
        verifyPassword(password);
        verifyConfirmPassword(password, confirmPassword);
        
        //check if there are any error messages and break out of function if there are errors
        if(inputErr.username.status || inputErr.password.status || inputErr.confirmPassword.status) return;

        setLoading(true);

        axios.post('/api/users/new', {
            username:username, 
            password:password, 
            withCredentials:true
        })
        .then( res => {
            if(res.data.status === 1){
                logInUser(username, password);
            }
            else if (res.data.status === 0){
                setInputErr({...inputErr, username:{message:'This username has already been taken.',status:true}})
            }
            else {
                throw new Error('There was an issue processing this request.')
            }
        })
        .catch(err => console.log(err))
        .finally(()=>{
            setLoading(false);
        });
    }

    const loadingBar =  <div data-testid='create-page-loading' className={classes.loading}>
                            <LinearProgress  />
                        </div>;

    
    return(
        <div className={classes.container}>
            <MainPageNav />
            {loading ? loadingBar : ''}
            <form className={classes.form} onSubmit={handleSubmit}>
                <h1>Create an Account</h1>
                <TextField className={classes.input} type='text' name='username' disabled={loading}
                    helperText={inputErr.username.message} error={inputErr.username.status}
                    label='Username' value={username} onChange={handleUsername} variant='outlined' required 
                    inputProps={{'data-testid':'create-page-username-input'}} 
                    FormHelperTextProps={{'data-testid':'create-page-username-helper'}} />
                <TextField className={classes.input} type='password' name='password' disabled={loading}
                    helperText={inputErr.password.message} error={inputErr.password.status}
                    label='Password' value={password} onChange={handlePassword} variant='outlined' required 
                    inputProps={{'data-testid':'create-page-password-input'}} 
                    FormHelperTextProps={{'data-testid':'create-page-password-helper'}} />
                <TextField className={classes.input} type='password' name='confirmPassword' disabled={loading}
                    helperText={inputErr.confirmPassword.message} error={inputErr.confirmPassword.status}
                    label='Confirm Password' value={confirmPassword} onChange={handleConfirmPassword} 
                    variant='outlined' required inputProps={{'data-testid':'create-page-confirm-input'}} 
                    FormHelperTextProps={{'data-testid':'create-page-confirm-helper'}} />
                <Button data-testid='create-page-submit' type='submit' variant='outlined' disabled={loading}>Sign Up</Button>
            </form>
        </div>
    );
}

export default CreateAccountPage; 