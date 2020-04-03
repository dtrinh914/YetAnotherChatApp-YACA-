import React, {useState, useEffect, useRef} from 'react';
import LifeCounters from './LifeCounters';
import CardSearcher from './CardSearcher';
import { v4 as uuid } from 'uuid';
import {makeStyles} from '@material-ui/styles';
import {debounce} from 'throttle-debounce';

const useStyle = makeStyles({
    root:{
        display: 'flex',
        justifyContent:'space-between',
        alignItems: 'center'
    }
});

export default function VideoTopTools({socket, channelId}) {
    const classes = useStyle();
    const [counters, setCounters] = useState([]);

    const countersState = useRef();
    useEffect(()=>{
        countersState.current = counters;
    });

    useEffect(() => {
        socket.on('update_video_tools_state', state =>{
            setCounters(JSON.parse(state));
        });

        socket.on('get_video_tools_state', id => {
            socket.emit('send_video_tools_state', id, JSON.stringify(countersState.current));
        });

        return () => {
            socket.off('update_video_tools_state');
            socket.off('get_video_tools_state');
        }
    }, [socket])

    const emitState = (state)=> {
        socket.emit('update_video_tools_state', channelId, JSON.stringify(state));
    }
    const debounceEmitState = debounce(emitState, 500);

    const handleLifeChange = (id, change) => {
        const newCounterState = counters.map(counter => {
            if(counter.id === id){
                const newCount = counter.count + change;
                return {...counter, count:newCount};
            } else {
                return counter;
            }
        });

        setCounters(newCounterState);
        debounceEmitState(newCounterState);
    };

    const addCounter = () => {
        if(counters.length < 12){
            const newCounterState = [...counters, {id: uuid(), count: 40}]
            setCounters(newCounterState);
            debounceEmitState(newCounterState);
        }
    }

    const removeCounter = () => {
        if(counters.length > 0){
            let newCounterState = [...counters];
            newCounterState.pop();
            setCounters(newCounterState);
            debounceEmitState(newCounterState);
        }   
    }

    const resetCounters = () => {
        let changed = false;
        const newCounterState = counters.map(counter => {
            if(counter.count !== 40){
                changed = true;
                return {...counter, count:40}
            } else {
                return counter
            }
        });

        if(changed){
            setCounters(newCounterState);
            debounceEmitState(newCounterState);
        }
    }

    return (
            <div className={classes.root}>
                <LifeCounters counters={counters}
                            handleLifeChange={handleLifeChange} 
                            addCounter={addCounter}
                            removeCounter={removeCounter}
                            resetCounters={resetCounters}/>
                <CardSearcher socket={socket} channelId={channelId} />
            </div>
    )
}
