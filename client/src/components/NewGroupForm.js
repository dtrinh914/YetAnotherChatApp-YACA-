import React, {useState, useRef, useEffect} from 'react';
import useInput from '../hooks/useInput';
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    root:{
        display: 'flex',
        position: 'fixed',
        top: 0,
        zIndex: 5000,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.4)'
    },
    paper:{
        width: '70%',
        maxWidth: '500px',
        padding: '30px 30px'
    },
    loadbar:{
        marginBottom: '10px'
    },
    form:{
        display: 'flex',
        flexDirection: 'column'
    },
    textInput:{
        marginBottom: '15px'
    }
})

function NewGroup({createNewGroup, close}){
    const [newGroup, setNewGroup] = useInput('');
    const [description, setDescription] = useInput('');
    const [inputErr, setInputErr] = useState({status:false, err:''})
    const [loading, setLoading] = useState(false);
    const nameInputRef = useRef(null);
    const classes = useStyles();

    useEffect(()=>{
        //targets the group name textfield 
        nameInputRef.current.children[1].children[0].focus();
    },[loading])

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!checkEmpty(newGroup)){
            setLoading(true);
            sendData();
        }
    }

    const handleError = (message) => {
        setInputErr({status:true, err:message})
        nameInputRef.current.children[1].children[0].focus();
    };

    //checks if group field is empty
    const checkEmpty = (input) => {
        if(input.trim() === ''){
            handleError('This field is required.');
            return true;
        }
        return false;
    }

    //sends data to backend and edits form based on response
    const sendData = async () =>{
        try{
            const res = await createNewGroup(newGroup, description);
            if(res === 1){
                setLoading(false);
                handleClose();
            } else if (res === 0){
                handleError('A group with this name already exists.');
            } else {
                handleError('An error occured while processing your request.');
            }
        } catch(err){
            handleError('An error occured while processing your request.');
        } finally {
            setLoading(false);
        }
    }

    // resets all values
    const handleClose = () =>{
        close();
    }

    // clears errors and updates state
    const handleGroupChange=(e)=>{
        setNewGroup(e);
        setInputErr({status:false, err:''});
    }

    return(
        <div className={classes.root}>
                <ClickAwayListener onClickAway={handleClose}>
                    <Paper className={classes.paper}>
                        {loading ? <LinearProgress data-testid='newgroupform-loading' className={classes.loadbar} /> : ''}

                        <form data-testid='newgroupform' className={classes.form} onSubmit={handleSubmit}>

                            <TextField inputProps={{'data-testid': 'newgroupform-group-name-input'}} ref={nameInputRef} 
                            FormHelperTextProps = {{'data-testid': 'newgroupform-group-name-error'}}
                            className={classes.textInput} label='Group Name' id='Group Name' 
                            type='text' name='newGroupName' value={newGroup} onChange={handleGroupChange}
                            error={inputErr.status} helperText={inputErr.err} disabled={loading} />

                            <TextField inputProps={{'data-testid': 'newgroupform-group-description-input'}} 
                            className={classes.textInput}  label='Group Description' id='Group Description' 
                            type='text' name='newGroupDescription' value={description} 
                            onChange={setDescription} disabled={loading}/>

                            <Button data-testid='newgroupform-submit' type='submit' disabled={loading}>Create Group</Button>
                            <Button data-testid='newgroupform-close' onClick={handleClose} disabled={loading}>Close</Button>
                        </form>
                    </Paper>
                </ClickAwayListener>
        </div>
    );
}

export default NewGroup;