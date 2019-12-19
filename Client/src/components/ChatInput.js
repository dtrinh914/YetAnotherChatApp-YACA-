import React from 'react';
import useInput from '../hooks/useInput';
import './ChatInput.css'

function ChatInput(props){
    const [message, setMessage, clearMessage] = useInput();

    function handleClick(){
        props.newMessage(message);
    }

    function handleSumbit(e){
        e.preventDefault()
        clearMessage();
    }
    return(
        <form className='ChatInput' onSubmit={handleSumbit}>
            <input type="text" value={message} onChange={setMessage} />
            <button onClick={handleClick}>Send</button>
        </form>
    );
}

export default ChatInput;