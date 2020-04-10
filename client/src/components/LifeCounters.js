import React, {useState, useEffect, useRef} from 'react';
import LifeCounter from '../components/LifeCounter';
import ConfirmationWindow from '../components/ConfirmationWindow';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import CachedIcon from '@material-ui/icons/Cached';
import {makeStyles} from '@material-ui/styles';
import { v4 as uuid } from 'uuid';

const useStyle = makeStyles({
    root:{
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        marginBottom: '8px',
        overflow: 'hidden'
    },
    title:{
        marginLeft: '24px',
        marginRight:'10px'
    },
    button:{
        color:'white'
    },
    counters:{
        display: 'flex'
    }
})

export default function LifeCounters({socket, channelId}) {
    const classes = useStyle();
    const [open, setOpen] = useState(false);
    const confirmationText = 'Are you sure you want to reset the values of these counters?';

    const [counters, setCounters] = useState([]);

    const countersState = useRef();
    useEffect(()=>{
        countersState.current = counters;
    });

    useEffect(() => {
        socket.on('update_counters', state =>{
            setCounters(JSON.parse(state));
        });

        socket.on('get_counters', id => {
            socket.emit('send_counters', id, JSON.stringify(countersState.current));
        });

        return () => {
            socket.off('update_counters');
            socket.off('get_counters');
        }
    }, [socket])

    const emitState = (state)=> {
        socket.emit('update_counters', channelId, JSON.stringify(state));
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

    const handleReset = () =>{
        setOpen(true);
    }

    const handleConfirm = () =>{
        resetCounters();
        setOpen(false);
    }
    
    const handleClose = () =>{
        setOpen(false);
    }

    return (
        <div className={classes.root}>
            <Typography className={classes.title}>LIFE COUNTERS</Typography>
            <IconButton className={classes.button} onClick={addCounter} size='small'>
                <AddCircleOutlineIcon/>
            </IconButton>
            <IconButton className={classes.button} onClick={removeCounter} size='small'>
                <RemoveCircleOutlineIcon/>
            </IconButton>
            <IconButton className={classes.button} onClick={handleReset} size='small'>
                <CachedIcon/>
            </IconButton>
            {counters.map(counter => <LifeCounter key={counter.id} id={counter.id}
                count={counter.count} handleLifeChange={handleLifeChange} />)}
            {open ? <ConfirmationWindow text={confirmationText} handleConfirm={handleConfirm} handleClose={handleClose} /> : ''}
        </div>
    )
}
