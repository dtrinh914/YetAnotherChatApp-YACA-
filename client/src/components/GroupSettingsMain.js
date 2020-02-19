import React from 'react'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export default function GroupSettingsMain({selectDelete, close}) {
    return (
        <>
            <Typography data-testid='group-settings-header' variant='h3'>Group Settings</Typography>
            <Button>Edit Group Description</Button>
            <Button>Edit Edit Member List</Button>
            <Button data-testid='group-settings-delete' onClick={selectDelete}>Delete Group</Button>
            <Button data-testid='group-settings-close' onClick={close}>Close</Button>
        </>
    )
}
