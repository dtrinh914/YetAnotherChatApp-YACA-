import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/styles';

const useStyle = makeStyles({
    base:{
        '&:hover':{
            backgroundColor: '#c5cae9'
        }
    },
    selected:{
        backgroundColor: '#c5cae9'
    }
});

export default function AutoCompleteItem({index, content, selected, clickItem}) {
    const classes = useStyle();
    const handleClick = () => {
        clickItem(index);
    };

    return (
        <ListItem onClick={handleClick} className={selected ? classes.selected : classes.base}>
            {content}
        </ListItem>
    )
}
