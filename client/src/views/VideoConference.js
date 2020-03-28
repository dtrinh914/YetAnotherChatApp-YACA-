import React, {useContext} from 'react';
import VideoContainer from '../components/VideoContainer';
import {NavContext} from '../contexts/navContext';

export default function VideoConference() {
    const {navDispatch} = useContext(NavContext);
    const handleGoBack = () => {
        navDispatch({type:'VIEW', view:'chat'})
    };

    return (
        <div>
            <VideoContainer/>
            <button onClick={handleGoBack}>Go Back</button>
        </div>
    )
}
