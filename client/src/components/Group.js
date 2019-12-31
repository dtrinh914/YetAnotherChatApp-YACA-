import React from 'react';

function Group({name, id, setGroup}){
    const handleClick = () => {
        setGroup(id);
    }
    return(
        <button onClick={handleClick}>{name}</button>
    );
}

export default Group