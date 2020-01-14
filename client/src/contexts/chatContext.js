import React, {createContext, useReducer} from 'react';
import chatReducer from '../reducers/chatReducer';

export const ChatContext = createContext();

export function ChatProvider(props){
    const [chatData,chatDispatch] = useReducer(chatReducer, "");
    return(
        <ChatContext.Provider value={{chatData, chatDispatch}}>
            {props.children}
        </ChatContext.Provider>
    )
}