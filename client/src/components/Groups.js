import React,{useContext} from 'react';
import Group from './Group';
import NewGroupForm from './NewGroupForm';
import {ChatContext} from '../contexts/chatContext';
import {NavContext} from '../contexts/navContext';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import {makeStyles} from '@material-ui/styles';


const useStyles = makeStyles({
    root:{
        padding: '10px 0px',
        textAlign: 'center',
        margin: 0
    },
    header:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 15px'
    },
    headerText:{
        fontWeight: 700,
    },
    list:{
        padding: 0
    }
});

function Groups({joinRoom}){
    const classes = useStyles();
    const {chatData,chatDispatch} = useContext(ChatContext);
    const {navData, navDispatch} = useContext(NavContext);
    const newGroupOpen = navData.leftNav.newGroup;

    const openNewGroup = () => {
        navDispatch({type:'NEWGROUP', open:true});
    }
    const closeNewGroup = () => {
        navDispatch({type:'NEWGROUP', open:false});
    }

    const createNewGroup = async (newGroupName, description) => {
        const res = await axios.post('/api/groups/', {
            newGroupName:newGroupName,
            description:description,
            withCredentials:true
        })

        if(res.data.status === 1){
            chatDispatch({type:'ADD_GROUP', payload: res.data.data});
            joinRoom(res.data.data._id);
            return 1;
        } else if(res.data.status === 0){
            return 0;
        } else {
            return -1;
        }  
    }

    const setGroup = (id, name, index) => {
        chatDispatch({type:'CHANGE_GROUP', selected:id, name:name, index:index});
        navDispatch({type:'LEFT', open: false});
        navDispatch({type:'LEFTDRAWER', open: false});
    }

    const groups = chatData.groups.map( group => {return {name:group.groupName, id:group._id}});

    return(
        <div className={classes.root} aria-label='group-nav'>
            <div className={classes.header}>
                <Typography className={classes.headerText}>Groups</Typography>
                <IconButton className={classes.create} color='inherit' size='small' onClick={openNewGroup}>
                    <AddCircleOutlineIcon fontSize='inherit'/>
                </IconButton>
            </div>
            <List className={classes.list}>
            {groups.map( (group, index) => <Group id={group.id} name={group.name} 
            key={group.id} setGroup={setGroup} index={index} />)}    
            </List>
            {newGroupOpen ? <NewGroupForm createNewGroup={createNewGroup} close={closeNewGroup} /> : ''}
        </div> 
    )
}

export default Groups;