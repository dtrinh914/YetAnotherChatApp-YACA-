import React from 'react'
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/styles';

const useStyle = makeStyles({
    root:{
        position: 'relative',
        width: '100%',
        padding: '20px 0',
    },
    text:{
        position:'absolute',
        zIndex: 80,
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#fafafa',
        padding: '8px 12px',
        borderRadius: '25px'
    },
    divider:{
        width:'95%',
        margin: '0 auto',
    }
})

export default function DateDivider({date}) {
    const classes = useStyle();

    return (
        <div className={classes.root}>
            <Typography className={classes.text}>{date}</Typography>
            <Divider className={classes.divider} />
        </div>
    )
}
