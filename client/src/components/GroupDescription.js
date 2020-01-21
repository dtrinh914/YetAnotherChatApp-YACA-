import React from 'react';

export default function GroupDescription({description}) {
    return (
        <div>
            <p>{description ? description : '[No description has been written]'}</p>
        </div>
    )
}
