import React, {useEffect, useRef} from 'react';
import Grid from '@material-ui/core/Grid';
import {useDrag, useDrop} from 'react-dnd';
import {makeStyles} from '@material-ui/styles';

const useStyle = makeStyles({
    root:{
        border: '3px solid rgba(63, 81, 181, 0.7)'
    }
});

export default function VideoContainer({feed, size, index, moveVideo}) {
    const classes = useStyle();
    const video = useRef();

    const handleMove = (toIndex) => {
        moveVideo(index, toIndex);
    };

    //handles drag events
    const [, drag] = useDrag({
        item: {type: 'video'},
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if(item && dropResult){
                handleMove(dropResult.toIndex);
            }
        }
    });

    //handles drop events
    const [{isOver},drop] = useDrop({
        accept: 'video',
        drop: () => ({toIndex: index}),
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    });

    const dnd = (el) => {
        drag(el);
        drop(el)
    };
    
    //clean up on exit
    useEffect(()=>{
        video.current.srcObject = feed;

        return () => {
            if(feed) feed.getTracks().forEach(track => track.stop());
        }
    },[feed]);

    return (
        <Grid className={isOver ? classes.root : ''} item xs={size} ref={dnd}>
            <video width='100%' autoPlay ref={video} style={{display:'block'}} />
        </Grid>
    )
}
