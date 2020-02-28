import React, {useState} from 'react';
import MainPageNav from '../components/MainPageNav';
import useInput from '../hooks/useInput';
import {Redirect,useHistory} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import {makeStyles} from '@material-ui/styles';
import axios from 'axios';

const useStyle = makeStyles({
    root:{
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
});

function LoginPage({loggedIn, setLoggedIn}){
    const classes = useStyle();
    const history = useHistory();
    const [username, setUsername] = useInput();
    const [password, setPassword] = useInput();
    const [inputErr, setInputErr] = useState({message:'', status:false});
    const [loading, setLoading] = useState(false);

    const loadingBar =  <div data-testid='loginpage-loading' className={classes.loading}>
                            <LinearProgress  />
                        </div>;

    const handleSubmit = async (e) => {
        try{
            e.preventDefault();
            setLoading(true);

            const response = await axios.post('/api/actions/login', {
                                                                       username:username,
                                                                       password:password,
                                                                       withCredentials:true
                                                                    });
            if(response.data.loggedIn){
                setLoggedIn(response.data);
                setLoading(false);
                history.push('/chat');
            } else {
                setLoading(false);
                setInputErr({message:'Username and/or password does not match.', status:true})
            }
        } catch(err){
            console.log(err);
        }
    }

    const handleUsername = e =>{
        setInputErr({message:'', status:false});
        setUsername(e);
    };

    const handlePassword = e =>{
        setInputErr({message:'', status:false});
        setPassword(e);
    };

    if(loggedIn){
        return <Redirect to='/chat' />
    } else {
        return(
            <div className={classes.root} >
                <MainPageNav />
                {loading ? loadingBar : ''}
                <form className={classes.form} onSubmit={handleSubmit}>
                    <h1>Sign In</h1>
                    <TextField inputProps={{'data-testid':'loginpage-username'}} 
                    FormHelperTextProps={{'data-testid':'loginpage-username-helper'}}
                    className={classes.input} type='text' name='username' id='username' 
                    label='Username' variant='outlined' value={username} required disabled={loading}
                    helperText={inputErr.message} error={inputErr.status} onChange={handleUsername} />
                    <TextField inputProps={{'data-testid':'loginpage-password'}}
                    className={classes.input} type="password" name='password' id='password' 
                    label='Password' variant='outlined' value={password} required disabled={loading}
                    onChange={handlePassword} error={inputErr.status} />
                    <Button data-testid={'loginpage-submit'} type='submit' variant="outlined" disabled={loading}>Login</Button>
                </form>
            </div>
        );
    }
}

export default LoginPage; 