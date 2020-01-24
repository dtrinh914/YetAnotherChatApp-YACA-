import React from 'react';
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

function ChatWindow({currentGroup}){
    const classes = useStyle();

    const formatMessages = (messages) => {
        let results = [];
        let dates = {};
        let memberMap = currentGroup.memberMap;
        
        // loop through each message
        for(let i = 0; i < messages.length; i++){
            // format the date of each message
            const date = new Date(messages[i].time);
            const formatedDate = format(date, 'E MMMM dd, yyyy');

            // check if the date is already in the dates hashtable
            if(!dates[formatedDate]){
                // if it isn't set it equal to true in the hashtable and push the date into results array
                dates[formatedDate] = true;
                results.push({date: formatedDate, type: 'date'});
            }

            //perform a join using the memberMap hashtable and add to results array
            results.push({...messages[i], username: memberMap[messages[i].id].username, type: 'message'})
        }

        return results;
    }

    return(
        <Paper className={classes.paper}>
            <List className={classes.list}>
                {formatMessages(currentGroup.messages).map( message => {
                    if(message.type === 'message'){
                        return <Message key={uuid()} message={message}/>
                    } else {
                        return <DateDivider date={message.date} />
                    }
                })}   
            </List>
        </Paper>
    );
}

export default ChatWindow;