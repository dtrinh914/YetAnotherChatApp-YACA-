import React from 'react'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/button';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    root:{
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        background: '#fafafa',
        overflow: 'auto',
    },
    logo:{
        display: 'flex',
        alignItems: 'center'
    },
    header:{
        display:'flex',
        justifyContent:'space-between',
        padding: '10px'
    },
    image:{
        width: '40px',
        marginRight: '10px'
    },
    body:{
        display:'flex',
        flexDirection: 'column',
        alignItems:'center',
        justifyContent: 'center',
        textAlign: 'center',
        margin: '10px',
        flexGrow: 1
    },
    heading:{
        marginBottom: '40px',
        animation: '$fade 0.7s ease-in',
    },
    button:{
        animation: '$fade 1s ease-in'
    },
    '@keyframes fade':{
        from:{opacity:0},
        to:{opacity:1}
    }
});

export default function Welcome({setLoggedIn, openNewGroup}) {
    const classes = useStyles();

    return (
        <div data-testid='welcome-container' className={classes.root}>
            <Paper className={classes.header} square>
                <div className={classes.logo}>
                    <img className={classes.image} alt='envelope' src='mail.png' />
                    <Typography>Untitled Chat App</Typography>
                </div>
                <Button onClick={setLoggedIn}>Logout</Button>
            </Paper>
            
            <div className={classes.body}>
                <Typography className={classes.heading} variant='h2'>Welcome!</Typography>
                <Typography className={classes.heading} variant='h4'>To get started:</Typography>
                <Button data-testid='welcome-newgroup-button' className={classes.button} color='primary' variant='contained' onClick={openNewGroup}>Click here to create your first group!</Button>
            </div>
        </div>
    )
}
