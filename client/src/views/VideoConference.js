import React, {useState, useRef, useEffect, useContext} from 'react';
import VideoContainer from '../components/VideoContainer';
import {NavContext} from '../contexts/navContext';

export default function VideoConference({socket, channelId, userId}) {
    const [loading, setLoading] = useState(true);
    const [clientList, setClientList] = useState([]);
    const [feeds, setFeeds] = useState([]);
    const [peerConnections, setPeerConnections] = useState([]);
    const {navDispatch} = useContext(NavContext);
    const {RTCPeerConnection, RTCSessionDescription, RTCIceCandidate} = window;

    const feedsState = useRef();
    const peerConnectionsState = useRef();
    const clientListState = useRef();
    useEffect(()=>{
        clientListState.current = clientList;
        feedsState.current = feeds;
        peerConnectionsState.current = peerConnections;
    });

    const createPeerConnection = (myId, peerId) => {
        let myPC = new RTCPeerConnection({
            iceServers:[
                {
                    urls: ['stun:stun.1.google.com:19302', 
                           'stun:stun.2.google.com:19302']
                }
            ]
        })

        var handleICECandidateEvent = (e) => {
            if(e.candidate){
                socket.emit('send_candidate', peerId, userId, JSON.stringify(e.candidate));
            }
        };

        var handleNegotiationNeededEvent = async () => {
            const offer = await myPC.createOffer();
            myPC.setLocalDescription(offer);
            socket.emit('send_offer', peerId, myId, JSON.stringify(offer));
         };
 
         var handleTrackEvent = (e) => {
             let feedExist = false;
             let newFeedState = feedsState.current.map(feed => {
                 if(feed.id === peerId){
                    feedExist = true;
                    return {...feed, stream: e.streams[0]}
                 } else{
                     return feed;
                 }
             });

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
 
         var handleICEConnectionStateChangeEvent = (e) => {
             switch(myPC.iceConnectionState){
                 case 'closed':
                 case 'failed':
                 case 'disconnected':
                     closeConnection();
                     break;
                default:
             }
         };
 
        var handleSignalingStateChangeEvent = (e)=> {
             switch(myPC.signalingState){
                case 'closed':
                     closeConnection();
                     break;
                default:
             }
         };
 
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
         };
    
        myPC.onicecandidate = handleICECandidateEvent;
        myPC.ontrack = handleTrackEvent;
        myPC.onnegotiationneeded = handleNegotiationNeededEvent;
        myPC.onremovetrack = handleRemoveTrackEvent;
        myPC.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
        myPC.onsignalingstatechange = handleSignalingStateChangeEvent;

       setPeerConnections(prevState => [...prevState, {id: peerId, connection: myPC}]);
       
       return myPC;
    }

    const handleGoBack = () => {
        socket.emit('leave_video', channelId, userId);
        navDispatch({type:'VIEW', view:'chat'});
    };

    //get client's camera/microphone data
    useEffect(()=>{
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

        navigator.mediaDevices.getUserMedia({audio:true, video:true})
            .then(stream =>{
                setFeeds(prevState => [...prevState, {id: userId, stream: stream}]);
                return stream;
            })
            .then( stream => {
                const state = clientListState.current;
                if(state.length > 1){
                    for(let i = 0; i < state.length; i++){
                        if(state[i] !== userId){
                            console.log('create connection');
                            const pc = createPeerConnection(userId, state[i]);
                            stream.getTracks().forEach(track => pc.addTrack(track, stream));
                        }
                    }
                }
            })
            .catch(handleGetUserMediaError);
       //eslint-disable-next-line
    },[userId]);

    useEffect(()=> {
        socket.emit('join_video', channelId, userId);
        
        socket.on('client_list', (ids) =>{
            const parsedIds = JSON.parse(ids);
            setClientList(parsedIds);
            setLoading(false);
        });
    
        socket.on('receive_offer', async(clientId, offer) => {
            const pc = createPeerConnection(userId, clientId);
            const desc = new RTCSessionDescription(JSON.parse(offer));
    
            await pc.setRemoteDescription(desc);
            const stream = feedsState.current[0].stream;
            stream.getTracks().forEach(track => pc.addTrack(track, stream));
            
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socket.emit('send_answer', clientId, userId, JSON.stringify(answer));
        });
    
        socket.on('receive_answer', async(clientId, answer) => {
            for(let i = 0; i < peerConnectionsState.current.length; i++){
                const pc = peerConnectionsState.current[i];
                if(pc.id === clientId){
                    await pc.connection.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
                }
            } 
        });
    
        socket.on('receive_candidate', (clientId, data)=>{
            const candidate = new RTCIceCandidate(JSON.parse(data)); 
            for(let i = 0; i < peerConnectionsState.current.length; i++){
                const pc = peerConnectionsState.current[i];
                if(pc.id === clientId){
                    pc.connection.addIceCandidate(candidate)
                        .catch(err => console.log(err));
                    break;
                }
            }    
        });
        
        
        return () => {
            //clean up socket listeners of room
            if(socket){
                socket.off('client_list');
                socket.off('receive_offer');
                socket.off('receive_candidate');
            }
        };
        //eslint-disable-next-line
    }, [channelId, userId, socket, RTCIceCandidate, RTCSessionDescription]);

    if(loading){
        return (
            <div>
                <h1>Loading</h1>
            </div>
        );
    } else {
        return(
            <div>
                {feeds.map(feed => <VideoContainer feed={feed.stream} />)}
                <button onClick={handleGoBack}>Go Back</button>
            </div>
        );
    }
}
