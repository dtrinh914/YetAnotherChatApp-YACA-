import React from 'react';
import useInput from '../hooks/useInput';
import './ChatInput.css'

function ChatInput(props){
    const [message, setMessage, clearMessage] = useInput();

    function handleClick(){
        props.newMessage(message);
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
            <button onClick={handleClick}>Send</button>
        </div>
    );
}

export default ChatInput;