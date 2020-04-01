import React, {useState} from 'react';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

export default function VideoMenu({feed, handleGoBack}) {
    const [cameraOn, setCameraOn] = useState(true);
    const [micOn, setMicOn] = useState(true);

    const handleCameraToggle = () => {
        if(cameraOn){
            feed.getVideoTracks()[0].enabled  = false;
            setCameraOn(false);
        } else {
            feed.getVideoTracks()[0].enabled  = true;
            setCameraOn(true);
        }
    }

    const handleMicToggle = () => {
        if(micOn){
            feed.getAudioTracks()[0].enabled  = false;
            setMicOn(false);
        } else {
            feed.getAudioTracks()[0].enabled  = true;
            setMicOn(true);
        }
    }

    return (
        <div style={{height:'50px',background:'#9e9e9e', display:'flex', justifyContent:'center'}}>
            <IconButton onClick={handleCameraToggle}>
                {cameraOn ? <VideocamIcon /> : <VideocamOffIcon/>}
            </IconButton>
            <IconButton onClick={handleMicToggle}>
                {micOn ? <MicIcon /> : <MicOffIcon/>}
            </IconButton>
            <Button onClick={handleGoBack}>Go Back</Button>
        </div>
    )
}
