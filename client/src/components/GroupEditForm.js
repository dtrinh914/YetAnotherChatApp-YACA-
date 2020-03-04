import React, {useRef, useEffect} from 'react';
import useInput from '../hooks/useInput';
import Textfield from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/styles';

const useStyle = makeStyles({
    form:{
        display:'flex',
        flexDirection: 'column'
    },
    input:{
        marginBottom: '10px'
    },
    button:{
        marginRight: '10px'
    },
    controls:{
        display:'flex',
        justifyContent: 'center'
    }
});

export default function GroupEditForm({groupName, groupDescription, selectMain, editGroup, loading}) {
    const classes = useStyle();
    const [description, setDescription] = useInput(groupDescription);
    const groupDescriptionRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        editGroup(description);
        selectMain();
    }

    useEffect(()=>{
        groupDescriptionRef.current.children[1].children[0].select();
    }, [])

    return (
        <form className={classes.form} onSubmit={handleSubmit}>
            <Textfield inputProps={{'data-testid':'group-edit-name'}} className={classes.input} value={groupName} label='Group Name' disabled />
            <Textfield inputProps={{'data-testid':'group-edit-description'}}ref={groupDescriptionRef} className={classes.input} value={description} 
                label='Group Description' onChange={setDescription} disabled={loading} />

            <div className={classes.controls}>
                <Button data-testid='group-edit-confirm' className={classes.button} type='submit' disabled={loading} >Confirm</Button>
                <Button data-testid='group-edit-back' onClick={selectMain} disabled={loading} >Go Back</Button>
            </div>
        </form>
    )
}
