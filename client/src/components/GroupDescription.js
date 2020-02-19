import React from 'react';

export default function GroupDescription({description}) {
    return (
        <div>
            <p data-testid='group-description'>{description ? description : '[No description has been written]'}</p>
        </div>
    )
}
