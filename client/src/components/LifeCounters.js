import React from 'react';
import LifeCounter from '../components/LifeCounter';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import CachedIcon from '@material-ui/icons/Cached';
import {makeStyles} from '@material-ui/styles';

const useStyle = makeStyles({
    root:{
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        marginBottom: '8px'
    },
    title:{
        marginRight:'10px'
    },
    button:{
        color:'white'
    },
    counters:{
        display: 'flex'
    }
})

export default function LifeCounters({counters, handleLifeChange, addCounter, removeCounter, resetCounters}) {
    const classes = useStyle();

    return (
        <div className={classes.root}>
            <Typography className={classes.title}>LIFE COUNTERS</Typography>
            <IconButton className={classes.button} onClick={addCounter} size='small'>
                <AddCircleOutlineIcon/>
            </IconButton>
            <IconButton className={classes.button} onClick={removeCounter} size='small'>
                <RemoveCircleOutlineIcon/>
            </IconButton>
            <IconButton className={classes.button} onClick={resetCounters} size='small'>
                <CachedIcon/>
            </IconButton>
            {counters.map(counter => <LifeCounter key={counter.id} id={counter.id}
                count={counter.count} handleLifeChange={handleLifeChange} />)}
        </div>
    )
}
