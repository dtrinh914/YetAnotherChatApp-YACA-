import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import {makeStyles} from '@material-ui/styles';

const useStyle = makeStyles({
    root:{
        display:'flex',
        width: '350px',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    select:{
        width: '250px'
    }
});

export default function VideoAudioSelect({label, options, setSelect}) {
    const classes = useStyle();

    return (
        <div className={classes.root}>
            <InputLabel htmlFor={`${label}-select`}>{label}</InputLabel>
            <NativeSelect className={classes.select} onChange={setSelect} id={`${label}-select`}>
                {options.map(item => <option key={item.id} value={item.id}>
                                            {item.label}
                                     </option>)}
            </NativeSelect>
        </div>
    )
}
