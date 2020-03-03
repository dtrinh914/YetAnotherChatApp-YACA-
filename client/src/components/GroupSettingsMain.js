import React from 'react'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export default function GroupSettingsMain({selectEdit, selectMembers, selectDelete, close, loading}) {
    return (
        <>
            <Typography data-testid='group-settings-header' variant='h3'>Group Settings</Typography>
            <Button data-testid='group-settings-editgroup' onClick={selectEdit} disabled={loading} >Edit Group Description</Button>
            <Button data-testid='group-settings-editmembers' onClick={selectMembers} disabled={loading} >Edit Edit Member List</Button>
            <Button data-testid='group-settings-delete' onClick={selectDelete} disabled={loading} >Delete Group</Button>
            <Button data-testid='group-settings-close' onClick={close} disabled={loading} >Close</Button>
        </>
    )
}
