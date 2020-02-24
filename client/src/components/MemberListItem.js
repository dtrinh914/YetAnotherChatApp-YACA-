import React from 'react';
import MemberItem from './MemberItem';
import useToggle from '../hooks/useToggle';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import {makeStyles} from '@material-ui/styles';

const useStyle = makeStyles({
    root:{
        padding: 0,
        margin: 0,
        marginLeft: '10px'
    },
    checkbox:{
        marginRight: '10px'
    }
});

export default function MemberListItem({username, id, handleCheck}) {
    const classes = useStyle();
    const [checked, toggleChecked] = useToggle(false);

    const handleChange = () => {
        toggleChecked();
        handleCheck(id);
    }


    return (
        <ListItem className={classes.root}> 
            <Checkbox inputProps={{'data-testid':'memberlistitem-checkbox'}} value={checked} onChange={handleChange} className={classes.checkbox} />
            <MemberItem username={username} /> 
        </ListItem>
    )
}
