import React from 'react'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export default function GroupSettingsMain({selectDelete, close}) {
    return (
        <>
            <Typography variant='h3'>Group Settings</Typography>
            <Button>Edit Group Description</Button>
            <Button>Edit Edit Member List</Button>
            <Button onClick={selectDelete}>Delete Group</Button>
            <Button onClick={close}>Close</Button>
        </>
    )
}
