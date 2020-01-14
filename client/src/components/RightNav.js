import React, {useContext} from 'react';
import Paper from '@material-ui/core/Paper';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import {makeStyles} from '@material-ui/styles';
import {ChatContext} from '../contexts/chatContext';
import AddMember from './AddMember';
import {NavContext} from '../contexts/navContext';

const useStyles = makeStyles({
    paperActive:{
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        height: '100vh',
        background:'#424242',
        color: 'white',
        overflow: 'auto'
    },
    paperHidden:{
        display: 'none'
    },
    divider:{
        width: '85%',
        backgroundColor: '#616161'
    }
});


export default function RightNav() {
    const {navData} = useContext(NavContext);
    const classes = useStyles();

    const rightNavStatus = navData.rightNav.root;
    const addMemStatus = navData.rightNav.addMem;
    return (
        <Hidden smDown >
            <Paper className={rightNavStatus ? classes.paperActive : classes.paperHidden} 
            variant='outlined'  square>
                <AddMember open={addMemStatus} />
            </Paper>
        </Hidden>
    )
}
