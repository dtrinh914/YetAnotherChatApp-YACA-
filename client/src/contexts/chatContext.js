import React, {createContext, useReducer} from 'react';
import chatReducer from '../reducers/chatReducer';

const initialState = {user:"", groups:"", selected:""}

export const ChatContext = createContext();

export function ChatProvider(props){
    const [chatData,chatDispatch] = useReducer(chatReducer, initialState);
    return(
        <ChatContext.Provider value={{chatData, chatDispatch}}>
            {props.children}
        </ChatContext.Provider>
    )
}