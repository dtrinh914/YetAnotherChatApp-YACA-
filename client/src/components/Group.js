import React from 'react';
import ListItem from '@material-ui/core/ListItem';

function Group({name, id, index, setGroup}){
    const handleClick = () => {
        setGroup(id, name, index);
    }
    return(
        <ListItem style={{padding:'2px 15px 2px 30px', fontSize:'0.85rem'}} onClick={handleClick} button>
            {name}
        </ListItem>
    );
}

export default Group;