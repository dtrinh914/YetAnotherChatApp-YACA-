import React, {useState, useRef, useEffect, useCallback} from 'react';
import useToggle from '../hooks/useToggle';
import useCardHistory from '../hooks/useCardHistory';
import AutoCompleteItem from './AutoCompleteItem';
import CardDisplay from './CardDisplay';
import SearchIcon from '@material-ui/icons/Search';
import HistoryIcon from '@material-ui/icons/History';
import Input from '@material-ui/core/Input';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
    searchIcon:{
        color:'white',
        minWidth: '30px'
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
    const [historyData, setHistoryData] = useCardHistory([]);
    const [cache, setCache] = useState({});
    const [displayOpen, setDisplayOpen] = useState(false); 
    const [historyOpen, toggleHistoryOpen] = useToggle(false);
    const [image, setImage]= useState([]);
    const [selected, setSelected] = useState(0);

    useEffect(()=>{
        valueRef.current = value;
    },[value]);

    useEffect(()=>{
        socket.on('get_card', data => {
            setHistoryData(data);
            setImage(data);
            setDisplayOpen(true);
        });

        return () => {
            socket.off('get_card');
        }
    },[socket, setHistoryData]);

    //get card image
    const getCard = async (index) => {
        const query = acData[index];
        const url = 'https://api.scryfall.com/cards/named?exact=' + query;
        try{
            const response = await axios.get(url);
        
            if(response.status === 200){
                const data = await response.data;
                
                //logic to handle double faced cards
                const imageUrls = data.image_uris ? [data.image_uris.normal] 
                                                  : data.card_faces.map(face => face.image_uris.normal);
                const cardData = {name: query, urls: imageUrls};
                setImage(cardData);
                setHistoryData(cardData);
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
        if(!historyOpen && acData.length > 0){
            setValue('');
            setACData([]);
            getCard(selected);
        } else if (historyOpen){
            getHistoryItem(selected);
        }
    };

    const handleKeyDown = (e) =>{
        const len = historyOpen ? historyData.length : acData.length;

        //on down arrow
        if(e.keyCode === 40){
        e.preventDefault();
        //scroll down 
            if(selected < len - 1){
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
                setSelected(len -1);
            }
        }
    };

    const clickCardItem = (index) => {
        setValue('');
        setACData([]);
        getCard(index);
    };

    const getHistoryItem = (index) => {
        setDisplayOpen(true);
        setImage(historyData[index]);
        toggleMenu();
    }

    const handleCloseDisplay = () => {
        setDisplayOpen(false);
    };

    const handleShare = () => {
        socket.emit('share_card', channelId, image);
    };

    //toggles search / histroy menu
    const toggleMenu = () => {
        setValue('');
        setACData([]);
        setSelected(0);
        toggleHistoryOpen();
    }

    const handleEnter = (e) => {
        e.preventDefault();
        if(e.keyCode === 13) handleSubmit(e);
    }

    return (
        <>
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            <div className={classes.search}>
                {historyOpen ?  <>
                                    <Button className={classes.searchIcon} onClick={toggleMenu} onKeyDown={handleEnter}>
                                        <HistoryIcon />
                                    </Button>
                                    <Typography className={classes.input}>Search History</Typography>
                                </>
                             :
                                <>
                                    <Button className={classes.searchIcon} onClick={toggleMenu} >
                                        <SearchIcon />
                                    </Button>
                                    <Input className={classes.input} disableUnderline value={value}
                                        placeholder='Card Search' onChange={handleChange} />
                                </>
                }
            </div>
            <div className={classes.container}>
                <div className={classes.results}>
                {historyOpen ?  <List className={classes.list}>
                                    {historyData.map( (item,index) => <AutoCompleteItem key={item.name} index={index} 
                                                                            content={item.name} selected={index === selected} 
                                                                            clickItem={getHistoryItem} />)}
                                </List>
                             :  <List className={classes.list}>
                                    {acData.map( (item,index) => <AutoCompleteItem key={item} index={index} 
                                                                        content={item} selected={index === selected}
                                                                        clickItem={clickCardItem} />)}
                                </List>
                }
                </div>
            </div>
        </form>
        {displayOpen ? <CardDisplay cardData={image} handleShare={handleShare} handleClose={handleCloseDisplay} /> : ''}
        </>
    )
}
