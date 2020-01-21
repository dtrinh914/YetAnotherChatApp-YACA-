import React, {createContext, useReducer} from 'react';
import navReducer from '../reducers/navReducer';

const initialState = {
    rightNav:{
        root:true,
        drawer: false,
        addMem:false
    },
    leftNav:{
        root: true,
        drawer: false,
        newGroup: false
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