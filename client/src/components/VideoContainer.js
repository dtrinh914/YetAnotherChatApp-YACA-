import React, {useEffect, useRef} from 'react';

export default function VideoContainer({feed}) {
    const video = useRef();
    
    //clean up on exit
    useEffect(()=>{
        video.current.srcObject = feed;

        return () => {
            if(feed) feed.getTracks().forEach(track => track.stop());
        }
    },[feed]);

    return (
        <video width='100%' autoPlay ref={video} />
    )
}
