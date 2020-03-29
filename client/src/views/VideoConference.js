import React, {useState, useEffect, useContext} from 'react';
import VideoContainer from '../components/VideoContainer';
import {NavContext} from '../contexts/navContext';

export default function VideoConference({socket, channelId, userId}) {
    const [loading, setLoading] = useState(true);
    const [clientList, setClientList] = useState([]);
    const {navDispatch} = useContext(NavContext);
    const handleGoBack = () => {
        socket.emit('leave_video', channelId, userId);
        navDispatch({type:'VIEW', view:'chat'});
    };

    useEffect(()=> {
        socket.on('client_list', (ids) =>{
            console.log(ids);
            setClientList(JSON.parse(ids));
            setLoading(false);
        });

        socket.emit('join_video', channelId, userId);
    }, [channelId, userId, socket]);

    if(loading){
        return (
            <div>
                <h1>Loading</h1>
            </div>
        );
    } else {
        return(
            <div>
                <VideoContainer/>
                <button onClick={handleGoBack}>Go Back</button>
            </div>
        );
    }
}
