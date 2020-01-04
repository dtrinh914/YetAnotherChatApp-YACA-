import {useState} from 'react';

export default function useToggle(initial=false){
    const [toggle, toggleState] = useState(initial);
    
    const switchState = () => {
        toggleState(!toggle)
    }
    return [toggle, switchState];
}