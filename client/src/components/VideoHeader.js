import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/styles';

const useStyle = makeStyles({
    bar:{
        color: 'white',
        height: '40px',
        display: 'flex',
        justifyContent: 'center'
    },
    tool:{
        justifyContent: 'space-between'
    },
    left:{
        display:'flex',
        alignItems: 'center'
    },
    brand:{
    }
});

export default function VideoHeader({groupName}) {
    const classes = useStyle();

    return (
        <AppBar className={classes.bar} position='static'>
            <Toolbar className={classes.tool}>
                <div className={classes.left}>
                    <Typography className={classes.brand}>{`${groupName} Video Call`}</Typography>
                </div>
            </Toolbar>
        </AppBar>
    )
}
