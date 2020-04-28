import React, {useEffect, useState} from 'react';
import VideoIOMenu from './VideoIOMenu';
import useToggle from '../hooks/useToggle';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import SettingsInputSvideoIcon from '@material-ui/icons/SettingsInputSvideo';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

export default function VideoMenu({feed, handleGoBack}) {
    const [IO, setIO] = useState(null);
    const [IoOpen, toggleIoOpen] = useToggle(false);
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
    };

    const handleMicToggle = () => {
        if(micOn){
            feed.getAudioTracks()[0].enabled  = false;
            setMicOn(false);
        } else {
            feed.getAudioTracks()[0].enabled  = true;
            setMicOn(true);
        }
    };

    useEffect(()=>{
        const getDevices = async () => {
            const deviceInfos = await navigator.mediaDevices.enumerateDevices();
            const formattedIO = {
                                    audioinput:[],
                                    audiooutput:[],
                                    videoinput:[]
                                };
    
            deviceInfos.forEach(device => {
                switch(device.kind){
                    case 'audioinput':
                    case 'audiooutput':
                    case 'videoinput':
                        formattedIO[device.kind].push({id:device.deviceId, label: device.label});
                        break;
                    default:
                        break;
                }
            });
            setIO(formattedIO);
        }

        getDevices();
    },[]);

    return (
        <>
        <div style={{height:'50px',background:'#9e9e9e', display:'flex', justifyContent:'center'}}>
            <IconButton onClick={handleCameraToggle} disabled={!feed}>
                {cameraOn ? <VideocamIcon /> : <VideocamOffIcon/>}
            </IconButton>
            <IconButton onClick={handleMicToggle} disabled={!feed}>
                {micOn ? <MicIcon /> : <MicOffIcon/>}
            </IconButton>
            <IconButton onClick={toggleIoOpen} disabled={!feed} >
                <SettingsInputSvideoIcon />
            </IconButton>
            <Button onClick={handleGoBack}>Go Back</Button>
        </div>
        {IoOpen ? <VideoIOMenu handleClose={toggleIoOpen} IO={IO} /> : ''}
        </>
    )
}
