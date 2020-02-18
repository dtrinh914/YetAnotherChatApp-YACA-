import React from 'react'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import {makeStyles} from '@material-ui/styles';

const useStyle = makeStyles({
    controls:{
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'center'
    },
    confirmBtn:{
        marginRight: '15px'
    }
});


export default function GroupDeleteForm({groupName, deleteGroup, selectMain}) {
    const classes = useStyle();

    const handleDelete = () =>{
        deleteGroup();
    };

    return (
        <>
            <Typography>Are you sure you want to delete {groupName}?</Typography>
            <div className={classes.controls}>
                <Button className={classes.confirmBtn} onClick={handleDelete} color='primary' variant='outlined'>
                    <CheckIcon />
                </Button>
                <Button color='secondary' variant='outlined' onClick={selectMain}>
                    <CloseIcon />
                </Button>
            </div>
        </>
    )
}
