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

export default function StatusBadge({online}) {
    const classes = useStyle();
    const badgeColor = online ? 'rgb(0,230,118)' : 'rgb(158,158,158)'

    return (
        <>
          <span className={classes.badgeOutline}></span>
          <span data-testid='status-badge-color' className={classes.badgeCore} style={{background: badgeColor}}></span>  
        </>
    )
}
