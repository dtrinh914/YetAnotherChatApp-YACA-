import React from 'react';
import Group from './Group';
import './Groups.css';

function Groups({groups, setGroup}){
    return(
        <div className='Groups'>
            <h1>Groups</h1>
            {groups.map( group => <Group setGroup={setGroup} id={group.id} name={group.name} key={group.id} />)}
        </div>
    )
}

export default Groups