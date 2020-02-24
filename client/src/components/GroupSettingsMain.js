import React from 'react'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export default function GroupSettingsMain({selectEdit, selectMembers, selectDelete, close}) {
    return (
        <>
            <Typography data-testid='group-settings-header' variant='h3'>Group Settings</Typography>
            <Button data-testid='group-settings-editgroup' onClick={selectEdit}>Edit Group Description</Button>
            <Button data-testid='group-settings-editmembers' onClick={selectMembers}>Edit Edit Member List</Button>
            <Button data-testid='group-settings-delete' onClick={selectDelete}>Delete Group</Button>
            <Button data-testid='group-settings-close' onClick={close}>Close</Button>
        </>
    )
}
