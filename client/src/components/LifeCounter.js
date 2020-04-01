import React from 'react'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import {makeStyles} from '@material-ui/styles/'

const useStyle = makeStyles({
    root:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    button:{
        padding: '0px'
    }
});

export default function LifeCounter({count, id, handleLifeChange}) {
    const classes = useStyle();

    const handleAdd = () =>{
        handleLifeChange(id, 1);
    }
    
    const handleSubtrack = () =>{
        handleLifeChange(id, -1);
    }

    return (
        <div className={classes.root}>
            <Button onClick={handleAdd} className={classes.button}>
                <ArrowUpwardIcon/>
            </Button>
            <Typography>{count}</Typography>
            <Button onClick={handleSubtrack} className={classes.button}>
                <ArrowDownwardIcon/>
            </Button>
        </div>
    )
}
