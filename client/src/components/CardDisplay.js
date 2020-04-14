import React, {useState, useEffect, useRef} from 'react'
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

export default function CardDisplay({urls, handleShare, handleClose}){
    const classes = useStyles();
    const [face, setFace] = useState(0);
    const containerRef = useRef(null);

    useEffect(()=>{
        containerRef.current.focus();
    },[])

    //switch image on click of double faced cards
    const handleFace = () => {
        if(urls.length > 1){
            const newState = face ? 0 : 1;
            setFace(newState);
        }
    };

    return (
        <div className={classes.root}>
            <ClickAwayListener onClickAway={handleClose} mouseEvent='onMouseDown'>
                <Paper className={classes.paper} ref={containerRef}>
                    <img onClick={handleFace} className={classes.img} src={urls[face]} alt='mtg-card' />
                    <div className={classes.display}> 
                        <Button onClick={handleShare}>Share</Button>
                        <Button onClick={handleClose}>Close</Button>
                    </div>
                </Paper>
            </ClickAwayListener>
        </div>
    )
}
