import React, {useRef, useState, useEffect} from 'react';
import uuid from 'uuid/v4';
import Message from './Message';
import DateDivider from './DateDivider';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import format from 'date-fns/format';
import {makeStyles} from '@material-ui/styles';

const useStyle = makeStyles({
    paper:{
        background: '#fafafa',
        overflow: 'auto',
        flexGrow: 1,
        flexShrink: 100
    },
    list:{
        margin: 0,
        padding: 0,
        wordBreak: 'break-word'
    }
});

function ChatWindow({memberMap, messages, groupId}){
    const classes = useStyle();
    const container = useRef(null);
    const [atBottom, setAtBottom] = useState(true);

    const formatMessages = (messages) => {
        let results = [];
        let dates = {};
        
        // loop through each message
        for(let i = 0; i < messages.length; i++){

            if(!memberMap[messages[i].id]){
                continue;
            }
            
            // format the date of each message
            const date = new Date(messages[i].time);
            const formatedDate = format(date, 'E MMMM dd, yyyy');

            // check if the date is already in the dates hashtable
            if(!dates[formatedDate]){
                // if it isn't set it equal to true in the hashtable and push the date into results array
                dates[formatedDate] = true;
                results.push({date: formatedDate, type: 'date', key:uuid()});
            }
            
            //perform a join using the memberMap hashtable and add to results array
            results.push({...messages[i], username: memberMap[messages[i].id].username, type: 'message', key:uuid()})
        }

        return results;
    };

    // add event listener on scroll to check if user is at bottom
    useEffect(()=>{
        const chatWindow = container.current;

        //check if user is at bottom and set state to true/false;
        const handleScroll = () =>{
            if(chatWindow.scrollHeight - chatWindow.scrollTop === chatWindow.clientHeight){
                setAtBottom(true);
            } else {
                setAtBottom(false);
            }
        };

        chatWindow.addEventListener('scroll', handleScroll);

        return () => chatWindow.removeEventListener('scroll', handleScroll)
    },[]);
    
    //when the group changes set the scroll to the bottom
    useEffect(()=>{
        container.current.scrollTop = container.current.scrollHeight;
    }, [groupId]);

    //set scroll to bottom when messages are added, only when user is already at the bottom
    useEffect(()=>{
        if(atBottom) container.current.scrollTop = container.current.scrollHeight;
        //eslint-disable-next-line
    }, [messages]);

    return(
        <Paper data-testid='chat-window' className={classes.paper} ref={container}>
            <List className={classes.list}>
                {formatMessages(messages).map( message => {
                    if(message.type === 'message'){
                        return <Message key={message.key} message={message}/>
                    } else {
                        return <DateDivider key={message.key} date={message.date} />
                    }
                })}
            </List>
        </Paper>
    );
}

export default ChatWindow;