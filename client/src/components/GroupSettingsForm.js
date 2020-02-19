import React, {useState} from 'react';
import GroupSettingsMain from './GroupSettingsMain';
import GroupDeleteForm from './GroupDeleteForm';
import Paper from '@material-ui/core/Paper';
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
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        justifyContent: 'center',
        width: '70%',
        maxWidth: '500px',
        height: '200px',
        padding: '20px 30px'
    },
    form:{
        display: 'flex',
        flexDirection: 'column'
    }
});

export default function GroupSettingsForm({groupName, close, deleteGroup}) {
    const classes = useStyles();
    const [view, switchView] = useState('main');

    const selectDelete = () => {
        switchView('delete');
    };

    const selectMain = () => {
        switchView('main')
    };

    const currentView = () => {
        if(view === 'delete'){
            return (<GroupDeleteForm groupName={groupName} deleteGroup={deleteGroup}  selectMain={selectMain} />);
        } else {
            return (<GroupSettingsMain close={close} selectDelete={selectDelete} />);
        }
    };

    return (
        <div className={classes.root}>
            <ClickAwayListener onClickAway={close}>
                <Paper className={classes.paper}>
                    {currentView()}
                </Paper>
            </ClickAwayListener>
        </div>
    )
}
