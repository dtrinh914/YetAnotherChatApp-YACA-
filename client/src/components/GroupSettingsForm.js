import React, {useState} from 'react';
import GroupSettingsMain from './GroupSettingsMain';
import GroupEditForm from './GroupEditForm';
import GroupEditMembers from './GroupEditMembers';
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
        width: '70%',
        maxWidth: '500px',
        minHeight: '200px',
        maxHeight: '70%',
        padding: '20px 30px',
        overflow: 'auto'
    },
    formatPaper:{
        display: 'flex',
        textAlign: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    }
});

export default function GroupSettingsForm({groupName, groupDescription, groupMembers, creator, close, editGroup, deleteGroup, deleteMembers}) {
    const classes = useStyles();
    const [view, switchView] = useState('main');
    const groupMemberList = groupMembers.filter(member => member._id !== creator);

    const selectEdit = () => {
        switchView('edit');
    };

    const selectMembers = () => {
        switchView('members');
    };

    const selectDelete = () => {
        switchView('delete');
    };

    const selectMain = () => {
        switchView('main')
    };

    const currentView = () => {
        if(view === 'delete'){
            return (<GroupDeleteForm groupName={groupName} deleteGroup={deleteGroup}  selectMain={selectMain} />);
        }
        else if(view === 'edit'){
            return (<GroupEditForm groupName={groupName} groupDescription={groupDescription} editGroup={editGroup} selectMain={selectMain} />);
        }
        else if(view === 'members'){
            return (<GroupEditMembers groupMembers={groupMemberList} selectMain={selectMain} deleteMembers={deleteMembers} />)
        } 
        else {
            return (<GroupSettingsMain close={close} selectEdit={selectEdit} 
                        selectMembers={selectMembers} selectDelete={selectDelete} />);
        }
    };

    return (
        <div className={classes.root}>
            <ClickAwayListener mouseEvent='onMouseDown' onClickAway={close}>
                <Paper className={view === 'members' ? classes.paper : `${classes.paper} ${classes.formatPaper}`}>
                    {currentView()}
                </Paper>
            </ClickAwayListener>
        </div>
    )
}
