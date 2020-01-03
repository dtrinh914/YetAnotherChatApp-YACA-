import React,{useContext} from 'react';
import Group from './Group';
import NewGroupForm from './NewGroupForm';
import './Groups.css';
import {ChatContext} from '../contexts/chatContext'
import axios from 'axios';

function Groups(){
    const {chatData,dispatch} = useContext(ChatContext);

    const createNewGroup = (newGroupName, groupId) => {
        axios.post('/api/groups/new', {
            newGroupName:newGroupName,
            withCredentials:true
        }).then( res => {
            console.log(res);
        })   
    }
    const setGroup = (id) => {
        dispatch({type:"CHANGE_ROOM", selected: id});
    }

    const groups = chatData.groups.map( group => {return {name:group.groupName, id:group._id}});

    return(
        <div className='Groups'>
            <h1>Groups</h1>
            {groups.map( (group) => <Group id={group.id} name={group.name} key={group.id} setGroup={setGroup} />)}
            <NewGroupForm createNewGroup={createNewGroup} />
        </div>
    )
}

export default Groups;