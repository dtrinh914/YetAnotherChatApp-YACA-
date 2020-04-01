import React, {useState, useEffect} from 'react';
import LifeCounters from '../components/LifeCounters';
import {makeStyles} from '@material-ui/styles/';
import { v4 as uuid } from 'uuid';

const useStyle = makeStyles({
    root:{
        backgroundColor: '#9e9e9e',
        height: '100px',
    }
});

export default function VideoOverlays({socket, channelId}) {
    const classes = useStyle();
    const [counters, setCounters] = useState([]);

    useEffect(() => {
        socket.on('overlay_state', state =>{
            setCounters(JSON.parse(state));
        });

        return () => {
            socket.off('overlay_state')
        }
    }, [])

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
        socket.emit('overlay_state', channelId, JSON.stringify(newCounterState));
    };

    const addCounter = () => {
        const newCounterState = [...counters, {id: uuid(), count: 40}]
        setCounters(newCounterState);
        socket.emit('overlay_state', channelId, JSON.stringify(newCounterState));
    }

    return (
        <div className={classes.root}>
            <LifeCounters counters={counters}
                          handleLifeChange={handleLifeChange} 
                          addCounter={addCounter}/>
        </div>
    )
}
