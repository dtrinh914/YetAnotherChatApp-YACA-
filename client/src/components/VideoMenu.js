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

export default function VideoMenu({userId, feed, setFeeds, peerConnections, handleGoBack}) {
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

    const handleInputChanges = (audioIn, videoIn) => {
        //stop tracks for current feed
        if(feed){
            feed.getTracks().forEach(track => {
                track.stop();
            });
        }

        //set contraints for new stream
        const constraints = {
            audio: {deviceId: audioIn},
            video: {deviceId: videoIn, width:{ideal:1280},height:{ideal:720}}
        };

        //get user media using contraints
        navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            //replace tracks on each peer connection
            const audioTrack = stream.getAudioTracks()[0];
            const videoTrack = stream.getVideoTracks()[0];

            peerConnections.forEach(pc => {
                const senders = pc.connection.getSenders();

                senders.forEach( s => {
                    if(s.track.kind === videoTrack.kind){
                        s.replaceTrack(videoTrack);
                    }
                    else if(s.track.kind === audioTrack.kind){
                        s.replaceTrack(audioTrack)
                    }
                })
            });

            //update old feed
            setFeeds(prevState => prevState.map( feed => {
                if(feed.id === userId) return {...feed, stream:stream};
                else return feed;
            }));
            setCameraOn(true);
            setMicOn(true);
        })
        .catch(err => {
            console.log(err);
        });
    };

    const getDevices = async () => {
        //get array of user devices
        const deviceInfos = await navigator.mediaDevices.enumerateDevices();
        const formattedIO = {
                                audioinput:[],
                                videoinput:[]
                            };
        
        //store audio and video inputs
        deviceInfos.forEach(device => {
            switch(device.kind){
                case 'audioinput':
                case 'videoinput':
                    formattedIO[device.kind].push({id:device.deviceId, label: device.label});
                    break;
                default:
                    break;
            }
        });
        setIO(formattedIO);
    };

    useEffect(()=>{
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
        {IoOpen ? <VideoIOMenu IO={IO} getDevices={getDevices} handleInputChanges={handleInputChanges} handleClose={toggleIoOpen}  /> : ''}
        </>
    )
}
