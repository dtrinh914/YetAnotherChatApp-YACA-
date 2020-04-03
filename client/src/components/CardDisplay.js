import React from 'react'
import {makeStyles} from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    root:{
        display: 'flex',
        position: 'fixed',
        top: 0,
        zIndex: 5000,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.4)'
    },
    paper:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        height:'50%',
        padding: '5px'
    },
    img:{
        width: 'auto',
        height: '90%'
    },
    controls:{
        display:'flex',
        marginTop: '5px'
    }
});

export default function CardDisplay({url, handleSend, handleClose}){
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <ClickAwayListener onClickAway={handleClose} mouseEvent='onMouseDown'>
                <Paper className={classes.paper}>
                    <img className={classes.img} src={url} alt='mtg-card' />
                    <div className={classes.display}> 
                        <Button>Share</Button>
                        <Button onClick={handleClose}>Close</Button>
                    </div>
                </Paper>
            </ClickAwayListener>
        </div>
    )
}
