import React, {useState, useRef, useEffect, useCallback} from 'react';
import AutoCompleteItem from './AutoCompleteItem';
import CardDisplay from './CardDisplay';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import List from '@material-ui/core/List';
import {makeStyles} from '@material-ui/styles';
import {throttle, debounce} from 'throttle-debounce';
import axios from 'axios'

const useStyle = makeStyles({
    search:{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#5c6bc0',
        borderRadius: '5px',
        height: '40px',
        width: '200px'
    },
    icon:{
        marginLeft: '10px',
        color:'white'
    },
    input:{
        color: 'white'
    },
    container:{
        zIndex: 1000,
        position:'fixed',
        height: '100vh',
    },
    results:{
        backgroundColor: '#5c6bc0',
        borderRadius: '0 0 5px 5px',
        position:'absolute',
        width: '200px',
        maxHeight: '70%',
        overflow: 'auto'
    },
    list:{
        padding: 0,
        color: 'white'
    }
});

export default function CardSearcher({socket, channelId}) {
    const classes = useStyle();
    const valueRef = useRef('');
    const [value, setValue] = useState('');
    const [acData, setACData] = useState([]);
    const [cache, setCache] = useState({});
    const [displayOpen, setDisplayOpen]  = useState(false); 
    const [image, setImage]= useState([]);
    const [selected, setSelected] = useState(0);

    useEffect(()=>{
        valueRef.current = value;
    },[value]);

    useEffect(()=>{
        socket.on('get_card', url => {
            setImage(url);
            setDisplayOpen(true);
        });

        return () => {
            socket.off('get_card');
        }
    },[socket]);

    //get card image
    const getCard = async (index) => {
        const query = acData[index];
        const url = 'https://api.scryfall.com/cards/named?exact=' + query;
        try{
            const response = await axios.get(url);
        
            if(response.status === 200){
                const data = await response.data;

                if(data.image_uris){
                    setImage([data.image_uris.normal]);
                //logic to deal with double-faced cards
                } else {
                    const imageUrls = data.card_faces.map(face => face.image_uris.normal);
                    setImage(imageUrls);
                }

                setDisplayOpen(true);
            }
        } catch(e){
            console.log(e);
        }
    };

    //get autocomplete data
    const autoComplete = async(value, cache) =>{
        const query = value;
        const url = 'https://api.scryfall.com/cards/autocomplete?q='+query

        //check if data is in cache
        if(cache[query]){
            if(valueRef.current) setACData(cache[query]);
            return;
        }

        try{
            const response = await axios.get(url);
            setSelected(0);

            if(response.status === 200 && query === valueRef.current){
                const data = await response.data;
                if(valueRef.current) setACData(data.data)
                setCache({...cache, [query]:data.data});
            }
        } catch(e){
            console.log(e);
        }
    };
  
    const autoCompleteThrottled = useCallback(throttle(200, autoComplete),[]);
    const autoCompleteDebounced = useCallback(debounce(200, autoComplete),[]);

    const handleChange = (e) => {
        const newVal = e.target.value;
        setValue(newVal);

        //check if the trimmed value of the new input and 
        // old input are different
        if(value && newVal.trim() !== value.trim()){
            if(newVal.length < 5){
                autoCompleteThrottled(newVal, cache);
            } else {
                autoCompleteDebounced(newVal, cache);
            }
        }
    };

    const handleSubmit = (e) =>{
        e.preventDefault();
        //reset the values on submit
        if(acData.length > 0){
            setValue('');
            setACData([]);
            getCard(selected);
        } 
    };

    const handleKeyDown = (e) =>{
        //on down arrow
        if(e.keyCode === 40){
        e.preventDefault();
        //scroll down 
            if(selected < acData.length){
                setSelected(selected + 1);
        //go to the topmost element
            } else{
                setSelected(0);
            }     
        }

        //on up arrow
        if(e.keyCode === 38){
        e.preventDefault();
        //scroll up
            if(selected > 0){
                setSelected(selected - 1)
            } else {
        //go to the bottommost element
                setSelected(acData.length -1);
            }
        }
    };

    const clickItem = (index) => {
        setValue('');
        setACData([]);
        getCard(index);
    };

    const handleCloseDisplay = () => {
        setDisplayOpen(false);
    };

    const handleShare = () => {
        socket.emit('share_card', channelId, image);
    };

    return (
        <>
        <form onSubmit={handleSubmit}>
            <div className={classes.search}>
                <SearchIcon className={classes.icon} />
                <Input className={classes.input} disableUnderline value={value}
                       placeholder='Card Search' onKeyDown={handleKeyDown}
                       onChange={handleChange} />
            </div>
            <div className={classes.container}>
                <div className={classes.results}>
                    <List className={classes.list}>
                        {acData.map( (item,index) => <AutoCompleteItem key={item} index={index} 
                                                        content={item} selected={index === selected}
                                                        clickItem={clickItem} />)}
                    </List>
                </div>
            </div>
        </form>
        {displayOpen ? <CardDisplay urls={image} handleShare={handleShare} handleClose={handleCloseDisplay} /> : ''}
        </>
    )
}
