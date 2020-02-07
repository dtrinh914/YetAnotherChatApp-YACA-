import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    root:{
        display:'flex',
        justifyContent: 'space-between',
        padding: 0
    },
    text:{
        fontSize:'0.85rem',
        marginLeft: '10px'
    },
    icon:{
        color:'white',
        fontSize: '1rem'
    },
    buttons:{
        display:'flex',
        marginRight: '10px'
    }
});


export default function GroupInviteItem({groupName, groupId, acceptInvite, declineInvite}) {
    const classes = useStyles();

    const handleAccept = () => {
        acceptInvite(groupId);
    }
    const handleDecline = () =>{
        declineInvite(groupId);
    }

    return (
        <ListItem className={classes.root}>
            <Typography data-testid='group-invite-name' className={classes.text}>{groupName}</Typography>
            <div className={classes.buttons}>
                <IconButton data-testid='group-invite-accept' size='small' onClick={handleAccept}>
                    <CheckIcon className={classes.icon} />
                </IconButton>
                <IconButton data-testid='group-invite-decline' size='small' onClick={handleDecline}>
                    <CloseIcon className={classes.icon} />
                </IconButton>
            </div>
        </ListItem>
    )
}
