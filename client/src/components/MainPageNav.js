import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/styles';

const useStyle = makeStyles({
    bar:{
        backgroundColor:'white',
        color: 'black'
    },
    tool:{
        justifyContent: 'space-between'
    },
    left:{
        display:'flex',
        alignItems: 'center'
    },
    link: {
        textDecoration: 'none'
    },
    brand:{
        fontSize: '2.0rem',
        fontFamily:'Nunito'
    },
    img:{
        width: '50px',
        margin: '10px 10px 10px 0'
    }
});


export default function MainPageNav() {
    const classes = useStyle();

    return (
        <AppBar className={classes.bar} position='static'>
            <Toolbar className={classes.tool}>
                <div className={classes.left}>
                    <img className={classes.img} src='/mail.png' alt='mail icon' />
                    <Typography className={classes.brand}>YACA</Typography>
                </div>
                <div className={classes.right}>
                    <Link className={classes.link} to='/'><Button>Log In</Button></Link>
                    <Link className={classes.link} to='/users/new'><Button>Sign Up</Button></Link>
                </div>
            </Toolbar>
        </AppBar>
    )
}
