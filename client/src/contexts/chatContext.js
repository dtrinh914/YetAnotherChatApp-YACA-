import React, {createContext, useReducer} from 'react';
import chatReducer from '../reducers/chatReducer';

export const ChatContext = createContext();

export function ChatProvider(props){
    const [chatData ,dispatch] = useReducer(chatReducer, "");
    return(
        <ChatContext.Provider value={{chatData, dispatch}}>
            {props.children}
        </ChatContext.Provider>
    )
}