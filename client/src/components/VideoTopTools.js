import React, {useState, useEffect} from 'react';
import LifeCounters from './LifeCounters';
import { v4 as uuid } from 'uuid';

export default function VideoTopTools({socket, channelId}) {
    const [counters, setCounters] = useState([]);

    useEffect(() => {
        socket.on('overlay_state', state =>{
            setCounters(JSON.parse(state));
        });

        return () => {
            socket.off('overlay_state')
        }
    }, [socket])

    const emitState = (state)=> {
        socket.emit('overlay_state', channelId, JSON.stringify(state));
    }

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
        emitState(newCounterState);
    };

    const addCounter = () => {
        if(counters.length < 12){
            const newCounterState = [...counters, {id: uuid(), count: 40}]
            setCounters(newCounterState);
            emitState(newCounterState);
        }
    }

    const removeCounter = () => {
        if(counters.length > 0){
            let newCounterState = [...counters];
            newCounterState.pop();
            setCounters(newCounterState);
            emitState(newCounterState);
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
            emitState(newCounterState);
        }
    }

    return (
            <LifeCounters counters={counters}
                          handleLifeChange={handleLifeChange} 
                          addCounter={addCounter}
                          removeCounter={removeCounter}
                          resetCounters={resetCounters}/>
    )
}
