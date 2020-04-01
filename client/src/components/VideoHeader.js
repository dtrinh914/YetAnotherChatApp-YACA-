import React from 'react';
import VideoTopTools from './VideoTopTools';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import {makeStyles} from '@material-ui/styles';

const useStyle = makeStyles({
    expansion:{
        '&$expanded':{
            margin: 0
        }
    },
    summary:{
        backgroundColor: '#3f51b5',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '35px',
        '&$expanded':{
            minHeight:'35px',
        }
    },
    content:{
        margin:0,
            '&$expanded':{
                margin: 0
        }
    },
    expanded:{},
    tool:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent:'space-between',
        backgroundColor: '#3f51b5',
        height: '70px',
        overflow:'hidden',
        paddingLeft: 0,
    },
    divider:{
        width:'100%',
        marginBottom: '10px',
        backgroundColor: '#283593'
    }
});

export default function VideoHeader({groupName, socket, channelId, setTopOpen}) {
    const classes = useStyle();

    const handleChange = () =>{
        setTopOpen(prevState => !prevState);
    }

    return (
        <ExpansionPanel onChange={handleChange} classes={{root:classes.expansion, expanded:classes.expanded}}>
            <ExpansionPanelSummary classes={{root:classes.summary,
                                             content:classes.content,
                                             expanded:classes.expanded}}
                                   IconButtonProps={{size:'small'}} 
                                   expandIcon={<ExpandMoreIcon/>}>
                <Typography>{`${groupName} Video Call`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.tool}>
                <Divider light={true} className={classes.divider}/>
                <VideoTopTools socket={socket} channelId={channelId} />
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
}
