import React,{useContext} from 'react';
import Group from './Group';
import NewGroupForm from './NewGroupForm';
import {ChatContext} from '../contexts/chatContext';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import {makeStyles} from '@material-ui/styles';


const useStyles = makeStyles({
    root:{
        padding: '20px 0px',
        textAlign: 'center'
    },
    header:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10px'
    },
    headerText:{
        fontWeight: 700
    }
});

function Groups(){
    const classes = useStyles();
    const {chatData,dispatch} = useContext(ChatContext);

    const createNewGroup = (newGroupName) => {
        axios.post('/api/groups/new', {
            newGroupName:newGroupName,
            withCredentials:true
        }).then( res => {
            console.log(res);
        })   
    }
    const setGroup = (id, name) => {
        dispatch({type:"CHANGE_GROUP", selected:id, name:name});
    }

    const groups = chatData.groups.map( group => {return {name:group.groupName, id:group._id}});

    return(
        <div className={classes.root} aria-label='group-nav'>
            <div className={classes.header}>
                <Typography className={classes.headerText}>Groups</Typography>
                <IconButton color='inherit' size='small'>
                    <AddCircleOutlineIcon/>
                </IconButton>
            </div>
            <List>
            {groups.map( (group) => <Group id={group.id} name={group.name} key={group.id} setGroup={setGroup} />)}    
            </List>
        </div> 
    )
}

export default Groups;