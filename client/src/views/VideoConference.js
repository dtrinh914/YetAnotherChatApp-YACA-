import React, {useState, useRef, useEffect, useContext, useCallback} from 'react';
import VideoHeader from '../components/VideoHeader';
import VideoContainer from '../components/VideoContainer';
import VideoMenu from '../components/VideoMenu';
import {NavContext} from '../contexts/navContext';
import {makeStyles} from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

const useStyle = makeStyles({
    root:{
        display: 'flex',
        flexDirection: 'column',
        width:'100%',
        height:'100%',
        overflow: 'hidden'
    },
    videos:{
        backgroundColor: '#eeeeee',
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center'
    }
});

export default function VideoConference({socket, channelId, userId, groupName}) {
    const classes = useStyle();
    const [loading, setLoading] = useState(true);
    const [clientList, setClientList] = useState([]);
    const [myFeed, setMyFeed] = useState(null);
    const [feeds, setFeeds] = useState([]);
    const [topOpen, setTopOpen] = useState(false);
    const [peerConnections, setPeerConnections] = useState([]);
    const {navDispatch} = useContext(NavContext);
    const {RTCPeerConnection, RTCSessionDescription, RTCIceCandidate} = window;

    //gets the prev state
    const feedsState = useRef();
    const peerConnectionsState = useRef();
    const clientListState = useRef();
    useEffect(()=>{
        clientListState.current = clientList;
        feedsState.current = feeds;
        peerConnectionsState.current = peerConnections;
    });

    const videosRef = useRef(null);

    //adjusts the left/right padding on resize to maintain aspect ratio of videos
    const adjPadding = useCallback(() => {
        const h = window.innerHeight;
        const w = window.innerWidth;
        //count of how many feeds
        const len = feedsState.current.length;
        const uiHeight = topOpen ? 227 : 90;
        //multiplier for top: when there is more than one video
        // the aspect ratio is doubled because the width is twice as long
        const top = len > 1 ? 2 : 1;

        //multiplier for bottom: when there is more than two videos
        // the aspect ratio is divided by two because there are now two rows of videos
        const bot = len > 2 ? 2 : 1;

        //padding needed = 
        // current width - the width need to preserve 16:9 aspect ratio at the current height
        // divided by two to account for padding being applied to both sides
        const calcValue = (w - (( (16 * top) / (9 * bot)) * (h - uiHeight) )) / 2 ;
        videosRef.current.style.setProperty('padding', `0 ${calcValue > 0 ? calcValue: 0}px`);
    }, [topOpen]);  

    //add event listener on load
    useEffect(()=>{
        if(!loading){
            window.addEventListener('resize', adjPadding);
            adjPadding();

            return () => window.removeEventListener('resize', adjPadding);
        }
    }, [loading, adjPadding]);

    //adjust padding when feeds and topOpen changes state
    useEffect(()=>{
        if(videosRef.current) adjPadding();
    },[topOpen, feeds, adjPadding])

    const createPeerConnection = (myId, peerId) => {
        //creates a new peer connection
        let myPC = new RTCPeerConnection({iceServers:[
                {
                    urls: [process.env.REACT_APP_ICE]
                }
        ]});

        //boolean to track if user created initial offer
        let createdOffer = false;

        //sends ice candidate to peer
        var handleICECandidateEvent = (e) => {
            if(e.candidate){
                socket.emit('send_candidate', peerId, userId, JSON.stringify(e.candidate));
            }
        };

        //creates and sends offer to peer
        var handleNegotiationNeededEvent = async (restarting = false) => {
            try{
            createdOffer = true;
            const parameters = restarting ? {iceRestart:true}:{};
            const offer = await myPC.createOffer(parameters);
            await myPC.setLocalDescription(offer);
            socket.emit('send_offer', peerId, myId, JSON.stringify(offer));
            } catch(e) {
                console.log(e)
            }
         };
         
         //adds stream tracks to client
         var handleTrackEvent = (e) => {
             let feedExist = false;

             //updates peer's stream if it exists
             let newFeedState = feedsState.current.map(feed => {
                 if(feed.id === peerId){
                    feedExist = true;
                    return {...feed, stream: e.streams[0]}
                 } else{
                     return feed;
                 }
             });

             //else create a new stream
            if(!feedExist) newFeedState.push({id:peerId, stream: e.streams[0]});

             setFeeds(newFeedState);
         };
 
         var handleRemoveTrackEvent = (e) => {
             const newFeeds = [];
             for(let i = 0; i < feedsState.current; i++){
                 const feed = feedsState.current[i];
                 if(feed.id === peerId){
                    const trackList = feed[0].stream.getTracks();
                    if(trackList.length === 0) closeConnection();
                 } else{
                     newFeeds.push(feed);
                 }
             }
             setFeeds(newFeeds);
         };
         
         //close the connection if ice connection errors out
         var handleICEConnectionStateChangeEvent = (e) => {
             switch(myPC.iceConnectionState){
                 case 'failed':
                    //only restart ICE if initially made offer
                    if(createdOffer){
                        if(myPC.restartIce) myPC.restartIce();
                        else handleNegotiationNeededEvent(true);
                    }
                    break;
                 case 'closed':
                     closeConnection();
                     break;
                default:
             }
         };
         
         //closes connection if signaling state is closed 
        var handleSignalingStateChangeEvent = (e)=> {
             switch(myPC.signalingState){
                case 'closed':
                     closeConnection();
                     break;
                default:
             }
         };
         
         //clears all of peer connections event listeners
        var closeConnection = () => {
             if(myPC){
                 myPC.onicecandidate = null;
                 myPC.ontrack = null;
                 myPC.onnegotiationneeded = null;
                 myPC.onremovetrack = null;
                 myPC.oniceconnectionstatechange = null;
                 myPC.onicegatheringstatechange = null;
                 myPC.onsignalingstatechange = null;
 
                 myPC.close();
                 myPC = null;
             }

            setPeerConnections(prevState => prevState.filter(pc => pc.id !== peerId));
            setFeeds(prevState => prevState.filter(feed => feed.id !== peerId));
         };
    
        myPC.onicecandidate = handleICECandidateEvent;
        myPC.ontrack = handleTrackEvent;
        myPC.onnegotiationneeded = handleNegotiationNeededEvent;
        myPC.onremovetrack = handleRemoveTrackEvent;
        myPC.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
        myPC.onsignalingstatechange = handleSignalingStateChangeEvent;

       //add peer connection to state
       setPeerConnections(prevState => [...prevState, {id: peerId, connection: myPC}]);
       
       return myPC;
    }

    //go back to main chat page
    const handleGoBack = () => {
        socket.emit('leave_video', channelId, userId);
        navDispatch({type:'VIEW', view:'chat'});
    };

    //get client's camera/microphone data
    useEffect(()=>{
        if(!loading){
            //check if user is the first in room, if not request the current life counter state
            //from the first user
            if(clientList[0] !== userId){
                socket.emit('get_counters', clientList[0], userId)
            }
            //handle errors on getting user's video/audio data
            const handleGetUserMediaError = (e) => {
                switch(e.name){
                    case 'NotFoundError':
                        alert('Unable to send video/voice data because '+
                            'no camera and/or microphone were found.');
                        break;
                    case 'SecurityError':
                    case 'PermissionDeniedError':
                        break;
                    default:
                        alert('Error opening your camera and/or microphone: ' + e.message);
                        break;
                }
            }
            //get user's audio and video data
            navigator.mediaDevices.getUserMedia({audio:true, video:{width:{ideal:1280},height:{ideal:720}}})
                .then(stream =>{
                    //store stream data in feeds state
                    setFeeds(prevState => [...prevState, {id: userId, stream: stream}]);
                    return stream;
                })
                .then( stream => {
                    //create a new peer connection for each client and adds user's stream
                    const state = clientListState.current;
                    if(state.length > 1){
                        for(let i = 0; i < state.length; i++){
                            if(state[i] !== userId){
                                const pc = createPeerConnection(userId, state[i]);
                                stream.getTracks().forEach(track => pc.addTrack(track, stream));
                            }
                        }
                    }
                })
                .catch(handleGetUserMediaError);
        }
        //eslint-disable-next-line
    },[userId,loading, socket]);

    useEffect(()=> {
        //subscribe to video channel
        socket.emit('join_video', channelId, userId);
        
        //update client list state and set loading state to false
        socket.on('client_list', (ids) =>{
            const parsedIds = JSON.parse(ids);

            //if parsedIds = false, maximum number of clients in room
            if(parsedIds){
                setClientList(parsedIds);
                setLoading(false);
            } else {
                alert('This room is currently full.');
                // send user back to previous page 
                navDispatch({type:'VIEW', view:'chat'});
            }
            
        });
    
        //on receiving offer
        socket.on('receive_offer', async(clientId, offer) => {
            try{
                //create new peer connection
                const pc = createPeerConnection(userId, clientId);

                //user offer data to set pc remote SD 
                const desc = new RTCSessionDescription(JSON.parse(offer));
                await pc.setRemoteDescription(desc);
                
                //attaches user's stream data to peer connection
                const stream = feedsState.current[0].stream;
                stream.getTracks().forEach(track => pc.addTrack(track, stream));
                
                //create answer and set local SD to answer
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                //send answer to peer
                socket.emit('send_answer', clientId, userId, JSON.stringify(answer));
            } catch(e){
                console.log(e)
            }
        });
    
        socket.on('receive_answer', async(clientId, answer) => {
            try{
                //find peerConnection and set remote SD to be answer
                for(let i = 0; i < peerConnectionsState.current.length; i++){
                    const pc = peerConnectionsState.current[i];
                    if(pc.id === clientId){
                        await pc.connection.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
                    }
                } 
            } catch(e){
                console.log(e);
            }
        });
    
        socket.on('receive_candidate', (clientId, data)=>{
            //create new ice candidate
            const candidate = new RTCIceCandidate(JSON.parse(data)); 
            //find peerConnection and set ice candidate
            for(let i = 0; i < peerConnectionsState.current.length; i++){
                const pc = peerConnectionsState.current[i];
                if(pc.id === clientId){
                    pc.connection.addIceCandidate(candidate)
                        .catch(err => console.log(err));
                    break;
                }
            }    
        });

        // alert when user becomes offline and go back to previous page
        const handleOfflineStatus = () => {
            alert('There seems to be a problem with your internet connection.');
            handleGoBack();
        };
        window.addEventListener('offline', handleOfflineStatus);
        
        return () => {
            //clean up socket listeners of room
            if(socket){
                window.removeEventListener('offline', handleOfflineStatus);
                socket.off('client_list');
                socket.off('receive_offer');
                socket.off('receive_candidate');
                socket.off('overlay_state');
            }
        };
        //eslint-disable-next-line
    }, [channelId, userId, socket, RTCIceCandidate, RTCSessionDescription]);

    //update feeds/PeerConnection on clientList changes
    useEffect(()=>{
        setPeerConnections(prevState => prevState.filter(pc => clientList.includes(pc.id)));
        setFeeds(prevState => prevState.filter(feed => clientList.includes(feed.id)));
    },[clientList])

    useEffect(()=>{
        let targetFeed;

        for(let i = 0; i < feeds.length; i++){
            if(feeds[i].id === userId){
                targetFeed = feeds[i];
                break;
            }
        }

        setMyFeed(targetFeed);
    },[feeds, userId])

    //change the index of the feeds, which changes placement of the videos
    const moveVideo = (currentIndex, toIndex) => {
        let newFeedState = [...feedsState.current];
        [newFeedState[currentIndex], newFeedState[toIndex]] = [newFeedState[toIndex], newFeedState[currentIndex]];
        setFeeds(newFeedState);
    };

    if(loading){
        return (
            <div>
                <h1>Loading</h1>
            </div>
        );
    } else {
        return(
            <DndProvider backend={Backend}> 
                <div className={classes.root}>
                    <VideoHeader groupName={groupName} socket={socket} 
                                channelId={channelId} setTopOpen={setTopOpen} />
                        <div className={classes.videos} ref={videosRef} >
                            <Grid container justify='center'>
                            {feeds.map( (feed,index) => <VideoContainer key={feed.id} feed={feed.stream} 
                                                    size={feeds.length > 1 ? 6 : 12} index={index} 
                                                    moveVideo={moveVideo} />)}
                            </Grid>
                        </div>
                    <VideoMenu userId={userId} feed={myFeed ? myFeed.stream : ''} setFeeds={setFeeds} 
                        peerConnections={peerConnections} handleGoBack={handleGoBack} />
                </div>
            </DndProvider>  
        );
    }
}
