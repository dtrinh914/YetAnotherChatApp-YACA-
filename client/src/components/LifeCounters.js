import React from 'react';
import LifeCounter from '../components/LifeCounter';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/styles';

const useStyle = makeStyles({
    root:{
        display:'flex',
        justifyContent:'center',
        alignItems: 'center',
    }
});

export default function LifeCounters({counters, handleLifeChange,addCounter}) {
    const classes = useStyle();

    return (
        <div className={classes.root}>
        {counters.map(counter => <LifeCounter key={counter.id} id={counter.id}
            count={counter.count} handleLifeChange={handleLifeChange} />)}
        <Button onClick={addCounter}>Add</Button>
        </div>
    )
}
