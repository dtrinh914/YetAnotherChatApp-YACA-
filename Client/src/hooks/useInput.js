import {useState} from 'react';

function useInput(initial = ''){
    const [input, setInput] = useState(initial);
    const onChange = e =>{
        setInput(e.target.value);
    }
    const reset = () =>{
        setInput('');
    }
    return [input, onChange, reset];
}

export default useInput;