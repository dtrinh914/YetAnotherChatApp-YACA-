import React, {useState, useEffect, useRef} from 'react';
import useInput from '../hooks/useInput';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import {makeStyles} from '@material-ui/styles/';


const useStyle = makeStyles({
    root:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'white'
    },
    button:{
        color: 'white',
        fontSize: '1rem',
        padding: '0px'
    },
    input: {
        fontSize: '1rem',
        fontWeight: '500',
        color: 'white',
        width: '30px',
        height: '28px',
        padding: 0
    }
});

export default function LifeCounter({count, id, handleLifeChange}) {
    const classes = useStyle();
    const [openEdit, setOpenEdit] = useState(false);
    const [value, setValue, resetValue] = useInput('');

    const handleAdd = () =>{
        handleLifeChange(id, count+1);
    };
    
    const handleSubtrack = () =>{
        handleLifeChange(id, count-1);
    };

    const handleOpenEdit = () => {
        setOpenEdit(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const parsed = parseInt(value);
        if(parsed) handleLifeChange(id, parsed);
        resetValue();
        setOpenEdit(false);
    };

    const inputRef = useRef(null);
    useEffect(()=>{
        if(openEdit) inputRef.current.children[0].focus();
    },[openEdit])

    return (
        <div className={classes.root}>
            <Button onClick={handleAdd} className={classes.button}>
                <ArrowUpwardIcon/>
            </Button>
            {openEdit ? <form onSubmit={handleSubmit}>
                            <Input className={classes.input} value={value} ref={inputRef} onBlur={()=>{setOpenEdit(false)}}
                                onChange={setValue} placeholder={count} disableUnderline />
                        </form>
                        : <Button onClick={handleOpenEdit} className={classes.button}>{count}</Button>}
            <Button onClick={handleSubtrack} className={classes.button}>
                <ArrowDownwardIcon/>
            </Button>
        </div>
    )
}
