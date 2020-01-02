import React from 'react';
import useInput from '../hooks/useInput';
import './NewGroupForm.css';

function NewGroup({createNewGroup}){
    const [newGroup, setNewGroup, resetNewGroup] = useInput('');

    const handleSubmit = (e) => {
        e.preventDefault();
        resetNewGroup();
        createNewGroup(newGroup, 'aabb');
    }
    return(
        <form onSubmit={handleSubmit}>
            <input type='text' name='newGroupName' value={newGroup} onChange={setNewGroup} />
            <button>Create New Group</button>
        </form>
    );
}

export default NewGroup;