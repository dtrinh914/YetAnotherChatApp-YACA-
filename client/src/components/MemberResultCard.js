import React from 'react';
import MemberItem from './MemberItem';
import ListItem from '@material-ui/core/ListItem';
import {makeStyles} from '@material-ui/styles';
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DoneIcon from '@material-ui/icons/Done';


const useStyles = makeStyles({
    root:{
        display:'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    add:{
        fontSize: '1rem'
    }
});

export default function MemberResultCard({username, userId, status, sendInvite}) {
    const classes = useStyles();

    const handleClick = () => {
        sendInvite(userId);
    }
    let statusButton;

    switch(status){
        case 'active':
            statusButton = <DoneIcon data-testid='active-icon' />
            break;
        case 'pending':
            statusButton = <Button data-testid='pending-icon'>Pending</Button>
            break;
        default:
            statusButton = <IconButton size='small' onClick={handleClick} data-testid='add-button'>
                                <AddCircleOutlineIcon className={classes.add} />
                            </IconButton>
            break;
    }
                        

    return (
        <ListItem data-testid='member-result-card' className={classes.root}>
            <MemberItem username={username} />
            {statusButton}
        </ListItem>
    )
}
