import React, {createContext, useReducer} from 'react';
import navReducer from '../reducers/navReducer';

const initialState = {
    rightNav:{
        root:false,
        addMem:false
    }
}

export const NavContext = createContext();

export function NavProvider(props){
    const [navData , navDispatch] = useReducer(navReducer, initialState);
    return(
        <NavContext.Provider value={{navData, navDispatch}}>
            {props.children}
        </NavContext.Provider>
    )
}