import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/styles';

const useStyle = makeStyles({
    footer:{
        textAlign:'center',
        padding: '20px',
        background: '#eeeeee',
    }
});

export default function Footer() {
    const classes = useStyle();
    
    return (
        <footer className={classes.footer}>
            <Typography>
            © Copyright 2020 YACA, Inc. All rights reserved. Various trademarks held by their respective owners.
            </Typography>
        </footer>
    )
}
