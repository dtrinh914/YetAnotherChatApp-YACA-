import React from 'react';
import useInput from '../hooks/useInput';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/styles'
import './ChatInput.css';

const useStyles = makeStyles({
    button:{
        borderRadius:0
    }
})

function ChatInput({onConfirm}){
    const classes = useStyles();
    const [message, setMessage, clearMessage] = useInput();

    function handleClick(){
        onConfirm(message);
        clearMessage();
    }
    
    function handleEnter(e){
        if(e.key === 'Enter'){
            e.preventDefault();
            handleClick();
        }
    }

    return(
        <div className='ChatInput'>
            <textarea type="text" value={message} onChange={setMessage} onKeyPress={handleEnter} />
            <Button className={classes.button} color="primary" variant="contained" onClick={handleClick}>Send</Button>
        </div>
    );
}

export default ChatInput;