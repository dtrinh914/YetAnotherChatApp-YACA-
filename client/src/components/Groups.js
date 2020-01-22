import React from 'react';
import Group from './Group';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/styles';


const useStyles = makeStyles({
    root:{
        padding: '10px 0px',
        textAlign: 'center',
        margin: 0
    },
    header:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 15px'
    },
    headerText:{
        fontWeight: 700,
    },
    list:{
        padding: 0
    }
});

function Groups({openNewGroup, groups, setGroup}){
    const classes = useStyles();

    return(
        <div className={classes.root} aria-label='group-nav'>
            <div className={classes.header}>
                <Typography className={classes.headerText}>Groups</Typography>
                <IconButton className={classes.create} color='inherit' size='small' onClick={openNewGroup}>
                    <AddCircleOutlineIcon fontSize='inherit'/>
                </IconButton>
            </div>
            <List className={classes.list}>
            {groups.map( (group, index) => <Group id={group.id} name={group.name} 
            key={group.id} setGroup={setGroup} index={index} />)}    
            </List>
        </div> 
    )
}

export default Groups;