import React from 'react';
import LifeCounters from './LifeCounters';
import CardSearcher from './CardSearcher';
import {makeStyles} from '@material-ui/styles';

const useStyle = makeStyles({
    root:{
        display: 'flex',
        justifyContent:'space-between',
        alignItems: 'center'
    }
});

export default function VideoTopTools({socket, channelId}) {
    const classes = useStyle();

    return (
            <div className={classes.root}>
                <LifeCounters socket={socket} channelId={channelId} />
                <CardSearcher socket={socket} channelId={channelId} />
            </div>
    )
}
