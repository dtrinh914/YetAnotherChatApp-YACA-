import React, {useState, useEffect, useRef} from 'react';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import IconButton from '@material-ui/core/IconButton';

export default function VideoContainer({feed}) {
    const video = useRef();
    const [cameraOn, setCameraOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    
    //clean up on exit
    useEffect(()=>{
        video.current.srcObject = feed;

        return () => {
            if(feed) feed.getTracks().forEach(track => track.stop());
        }
    },[feed])

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
        <div style={{width:'80%', height:'80%'}}>
            <video style={{width:'100%', height:'80%'}}autoPlay ref={video}></video>
            <div style={{background:'grey', display:'flex', justifyContent:'center'}}>
                <IconButton onClick={handleCameraToggle}>
                    {cameraOn ? <VideocamIcon /> : <VideocamOffIcon/>}
                </IconButton>
                <IconButton onClick={handleMicToggle}>
                    {micOn ? <MicIcon /> : <MicOffIcon/>}
                </IconButton>
            </div>
        </div>
    )
}
