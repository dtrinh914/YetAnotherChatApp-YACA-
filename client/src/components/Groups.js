import React,{memo} from 'react';
import Group from './Group';
import NewGroupForm from './NewGroupForm';
import './Groups.css';

function Groups({groups, setGroup, createNewGroup}){
    return(
        <div className='Groups'>
            <h1>Groups</h1>
            {groups.map( group => <Group setGroup={setGroup} id={group.id} name={group.name} key={group.id} />)}
            <NewGroupForm createNewGroup={createNewGroup} />
        </div>
    )
}

export default Groups