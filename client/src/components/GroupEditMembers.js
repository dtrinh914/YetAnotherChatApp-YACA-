import React, {useState, useEffect} from 'react';
import MemberListItem from './MemberListItem';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/styles';



const useStyles = makeStyles({
    root:{
        display:'flex',
        flexDirection:'column'
    },
    header:{
        textAlign:'center',
        marginBottom:'10px'
    },
    divider:{
        marginBottom:'10px'
    },
    label:{
        fontSize: '1em',
        padding: 0,
        margin: 0 
    },
    list:{
        padding:0
    },
    controls:{
        display:'flex',
        justifyContent: 'center'
    }
});

export default function GroupEditMembers({groupMembers, selectMain, deleteMembers}) {
    const classes = useStyles();
    const [membersState, setMemberState] = useState([]);

    useEffect(()=> {
        const formatState = groupMembers.map(member => {return {...member, checked:false}});
        setMemberState(formatState);
    }, [groupMembers]);

    const handleCheck = (id) =>{
        const newState = membersState.map(member => {
            if(member._id === id){
                return {...member, checked:!member.checked};
            } else{
                return member;
            }
        });
        setMemberState(newState);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //get array of members whose name has been checked
        const removeMembers = membersState.filter(member => member.checked === true);
        const removeIds = removeMembers.map(member => member._id);
        deleteMembers(removeIds);
    }
    
    return (
        <form className={classes.root} onSubmit={handleSubmit}>
            <Typography className={classes.header} variant='h3'>Member List</Typography>
            <Divider className={classes.divider} />
            <Typography className={classes.label}>Selected</Typography>
            <List data-testid='group-editmembers-list' className={classes.list}>
                {membersState.map(member => <MemberListItem key={member._id} 
                                                            username={member.username}
                                                            id={member._id}
                                                            handleCheck={handleCheck} />)}
            </List>
            <div className={classes.controls}>
                <Button data-testid='group-editmembers-confirm' type='submit'>Remove Selected</Button>
                <Button data-testid='group-editmembers-back' onClick={selectMain}>Go Back</Button>
            </div>
        </form>
    )
}
