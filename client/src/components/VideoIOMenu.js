import React from 'react';
import VideoAudioSelect from './VideoAudioSelect';
import useInput from '../hooks/useInput';
import {makeStyles} from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
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
        alignItems: 'center',
        textAlign: 'center',
        width: '70%',
        maxWidth: '500px',
        padding: '30px 30px'
    },
    heading:{
        fontSize:'1.5rem',
        marginBottom: '10px'
    },
    controls:{
        marginTop: '10px'
    },
    button:{
        marginRight: '5px'
    }
});

export default function VideoIOMenu({IO, handleClose}){
    const classes = useStyles();
    const [audioIn, setAudioIn] = useInput('');
    const [audioOut, setAudioOut] = useInput('');
    const [videoIn, setVideoIn] = useInput('');
    

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className={classes.root}>
            <ClickAwayListener onClickAway={handleClose} mouseEvent='onMouseDown'>
                <Paper className={classes.paper}>
                    <form onSubmit={handleSubmit}>
                        <Typography className={classes.heading} variant='h1'>
                            Video and Audio Settings
                        </Typography>
                        <VideoAudioSelect label='Audio Input' options={IO.audioinput} setSelect={setAudioIn} />
                        <VideoAudioSelect label='Audio Output' options={IO.audiooutput} setSelect={setAudioOut} /> 
                        <VideoAudioSelect label='Video Input' options={IO.videoinput} setSelect={setVideoIn} /> 
                        <div className={classes.controls}> 
                            <Button className={classes.button} type='submit'>Save</Button>
                            <Button onClick={handleClose}>Close</Button>
                        </div>
                    </form>
                </Paper>
            </ClickAwayListener>
        </div>
    )
}