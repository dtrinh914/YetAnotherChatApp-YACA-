import React from 'react'
import {makeStyles} from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

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
        alignItems: 'center',
        textAlign: 'center',
        width: '70%',
        maxWidth: '500px',
        padding: '30px 30px'
    },
    text:{
        marginBottom: '10px'
    },
    controls:{
        display:'flex'
    },
    confirmBtn:{
        marginRight: '10px'
    }
});

export default function ConfirmationWindow({text, handleConfirm, handleClose}){
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <ClickAwayListener onClickAway={handleClose} mouseEvent='onMouseDown'>
                <Paper className={classes.paper}>
                    <Typography data-testid='confirmation-text' className={classes.text}>{text}</Typography>
                    <div className={classes.controls}>
                        <Button data-testid='confirmation-confirm' className={classes.confirmBtn}
                        onClick={handleConfirm} color='primary' variant='outlined'>
                            <CheckIcon />
                        </Button>
                        <Button data-testid='confirmation-close' color='secondary' variant='outlined' onClick={handleClose}>
                            <CloseIcon />
                        </Button>
                    </div>
                </Paper>
            </ClickAwayListener>
        </div>
    )
}
