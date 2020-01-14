import React,{useContext} from 'react';
import useToggle from '../hooks/useToggle';
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
        margin: 0,
        overflow: 'hidden',
        overflowY: 'scroll'
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

function Groups(){
    const classes = useStyles();
    const {chatData,chatDispatch} = useContext(ChatContext);
    const {navDispatch} = useContext(NavContext);
    const [openCreate, toggleOpenCreate] = useToggle(false)

    const createNewGroup = async (newGroupName, description) => {
        const res = await axios.post('/api/groups/', {
            newGroupName:newGroupName,
            description:description,
            withCredentials:true
        })

        if(res.data.status === 1){
            chatDispatch({type:'INIT', payload: res.data.data})
            return 1;
        } else if(res.data.status === 0){
            return 0;
        } else {
            return -1;
        }  
    }

    const setGroup = (id, name, index) => {
        chatDispatch({type:'CHANGE_GROUP', selected:id, name:name, index:index});
        navDispatch({type:'CLOSERIGHT'})
    }

    const groups = chatData.groups.map( group => {return {name:group.groupName, id:group._id}});

    return(
        <div className={classes.root} aria-label='group-nav'>
            <div className={classes.header}>
                <Typography className={classes.headerText}>Groups</Typography>
                <IconButton className={classes.create} color='inherit' size='small' onClick={toggleOpenCreate}>
                    <AddCircleOutlineIcon fontSize='inherit'/>
                </IconButton>
            </div>
            <List className={classes.list}>
            {groups.map( (group, index) => <Group id={group.id} name={group.name} 
            key={group.id} setGroup={setGroup} index={index} />)}    
            </List>
            <NewGroupForm openCreate={openCreate} toggleOpenCreate={toggleOpenCreate} createNewGroup={createNewGroup} />
        </div> 
    )
}

export default Groups;