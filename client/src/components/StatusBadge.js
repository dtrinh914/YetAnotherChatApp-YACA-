import React from 'react';
import {makeStyles} from '@material-ui/styles';

const useStyle = makeStyles({
    badgeOutline:{
        background: '#424242',
        position: 'relative',
        top: '12px',
        right: '25px',
        padding: '8px',
        borderRadius:'25px',
    },
    badgeCore:{
        position: 'relative',
        top: '12px',
        right: '38px',
        padding: '5px',
        borderRadius:'25px',
    }
})

export default function StatusBadge({status}) {
    const classes = useStyle();
    const badgeColor = status === 'online' ? '#00e676' : '#9e9e9e'

    return (
        <>
          <span className={classes.badgeOutline}></span>
          <span className={classes.badgeCore} style={{background: badgeColor}}></span>  
        </>
    )
}
