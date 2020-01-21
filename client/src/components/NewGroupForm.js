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
        zIndex: 500,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.4)'
    },
    hidden:{
        display: 'none',
    },
    paper:{
        width: '80%',
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

    //checks if group field is empty
    const checkEmpty = (input) => {
        if(input.trim() === ''){
            setInputErr({status:true, err:'This field is required.'})
            return true;
        }
        return false;
    }

    //sends data to backend and edits form based on response
    const sendData = async () =>{
        const res = await createNewGroup(newGroup, description)
        setLoading(false);
        if(res === 1){
            handleClose();
        } else if (res === 0){
            setInputErr({status:true, err:'A group with this name already exists.'})
        } else {
            setInputErr({status:true, err:'An error occured while processing your request.'})
        }
    }

    // resets all values
    const handleClose = () =>{
        close();
    }

    // clears errors and updates state
    const handleGroupChange=(e)=>{
        setNewGroup(e);
    }

    return(
        <div className={classes.root}>
                <ClickAwayListener onClickAway={handleClose}>
                    <Paper className={classes.paper}>
                        <LinearProgress className={loading ? classes.loadbar : classes.hidden} />
                        <form className={classes.form} onSubmit={handleSubmit}>
                            <TextField ref={nameInputRef} className={classes.textInput} label='Group Name' 
                            id='Group Name' type='text' name='newGroupName' 
                            value={newGroup} onChange={handleGroupChange} error={inputErr.status}
                            helperText={inputErr.err} disabled={loading} />
                            <TextField className={classes.textInput}  label='Group Description' 
                            id='Group Description' type='text' name='newGroupDescription' 
                            value={description} onChange={setDescription} disabled={loading}/>
                            <Button type='submit' disabled={loading}>Create Group</Button>
                        </form>
                        <Button onClick={handleClose} disabled={loading}>Close</Button>
                    </Paper>
                </ClickAwayListener>
        </div>
    );
}

export default NewGroup;