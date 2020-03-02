import React from 'react';
import MainPageNav from '../components/MainPageNav';
import Footer from '../components/Footer';
import {Redirect} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import {makeStyles} from '@material-ui/styles';



const useStyle = makeStyles({
    jumbo:{
        color: 'white',
        textAlign: 'left-align',
        background:"url('landingSmall.jpg')",
        backgroundRepeat: 'no-repeat',
        backgroundPositionX:'right',
        backgroundSize:'cover',
        padding: '200px 50px',
        '& h1':{
            animation: '$fade 1s ease-in'
        },
        '& h4':{
            animation: '$fade 1.5s ease-in'
        },
        '& p':{
            animation: '$fade 2s ease-in'
        }
    },
    '@keyframes fade':{
        from:{opacity:0},
        to:{opacity:1}
    },
    '@media (min-width: 1428px)':{
        jumbo:{
            background:"url('landing.jpg')",
            backgroundPositionX: 'right',
        }
    },
    '@media (min-width: 1650px)':{
        jumbo:{
            backgroundPosition: 'center'
        }
    },
    line:{
        marginTop:'10px'
    },
    description:{
        display:'flex',
        flexDirection: 'column',
        alignItems:'center',
        textAlign:'center',
        margin: '75px 0 55px 0',
        '& h2':{
            fontWeight:'bold'
        },
        '& img':{
            margin: '50px 0',
            width: '50%',
            maxWidth: '400px'
        },
    },
    grid:{
        maxWidth:'1000px'
    },
    textContainer:{
        margin: '0 auto',
        marginBottom: '20px',
        width:'200px',
        textAlign: 'center'
    },
    about:{
        display:'flex',
        flexDirection: 'column',
        alignItems:'center',
        textAlign:'center',
        margin: '75px 0',
        '& h2':{
            fontWeight:'bold'
        }
    }
});

export default function LandingPage({loggedIn}) {
    const classes = useStyle();
    if(loggedIn){
        return <Redirect to='/chat' />
    } else {
        return (
            <div className={classes.root}>
                <MainPageNav />
                <Paper className={classes.jumbo} square>
                    <Typography variant='h1'>It's Time.</Typography>
                    <Typography variant='h4'>To join yet another chat app.</Typography>
                    <Typography className={classes.line}>YACA is a demo chat application made to fill some guy's portfolio.</Typography>
                </Paper>
                <article className={classes.description}>
                    <Typography variant='h2'>Connect With Others</Typography>
                    <img src='group.svg' alt='illustration of a group' />
                    <Grid className={classes.grid} container justify='center' >
                        <Grid xs={12} md={4} item>
                            <div className={classes.textContainer}>
                                <Typography variant='h6'>Create Groups</Typography>
                                <Typography>YACA lets you create groups to manage all of your social contacts.</Typography>
                            </div>
                        </Grid>
                        <Grid xs={12} md={4} item>
                            <div className={classes.textContainer}>
                                <Typography variant='h6'>Chat With Friends</Typography>
                                <Typography>It's easy to share messages between friends.</Typography>
                            </div>
                        </Grid>
                        <Grid xs={12} md={4} item>
                            <div className={classes.textContainer}>
                                <Typography variant='h6'>Collaborate</Typography>
                                <Typography>Groups can be used to work with others.</Typography>
                            </div>
                        </Grid>
                    </Grid>
                </article>

                <Divider />

                <article className={classes.about}>
                    <Grid className={classes.grid} container justify='center' alignItems='center'>
                        <Grid xs={12} md={8} item>
                            <Typography variant='h2'>YACA is Open Source</Typography>
                            <Typography>Built with Mongo, Express, React, and NodeJS</Typography>
                        </Grid>
                        <Grid xs={12} md={4} item>
                            <a href='https://github.com/dtrinh914/YetAnotherChatApp-YACA-.git'><Typography>Find us over at github.</Typography></a>
                        </Grid>
                    </Grid>
                </article>
                <Footer />
            </div>
        )
    }
}
