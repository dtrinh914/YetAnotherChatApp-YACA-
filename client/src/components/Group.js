import React from 'react';
import ListItem from '@material-ui/core/ListItem';

function Group({name, id, setGroup}){
    const handleClick = () => {
        setGroup(id, name);
    }
    return(
        <ListItem style={{padding:'5px 15px'}} onClick={handleClick} button>{name}</ListItem>
    );
}

export default Group;