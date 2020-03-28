import React, {useState, useEffect, useRef} from 'react';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import IconButton from '@material-ui/core/IconButton';

export default function VideoContainer() {
    const video = useRef();
    const [cameraOn, setCameraOn] = useState(false);
    const [micOn, setMicOn] = useState(false);
    const [feed, setFeed] = useState();
    
    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({audio:true, video:true})
            .then(stream =>{
                setFeed(stream);
                video.current.srcObject = stream;
                setCameraOn(true);
                setMicOn(true);
            })
            .catch(err => console.log(err));
    },[])

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
