import React from 'react';
import GroupInvites from '../components/GroupInvites';
import {cleanup, render} from '@testing-library/react';

afterEach(cleanup);

test('should return empty component', ()=>{
    const {getByTestId} = render (<GroupInvites />);
    expect(getByTestId('group-invites-list').children.length).toBe(0);
});

test('should return component with 3 list items', ()=>{
    const seedData = [
                        {_id:12345, groupName:'test_group1'},
                        {_id:67890, groupName:'test_group2'},
                        {_id:13579, groupName:'test_group3'}
                     ]
    const{getByTestId} = render(<GroupInvites pendingInvites={seedData} />);
    const groups = getByTestId('group-invites-list').children;

    expect(groups.length).toBe(3);
    expect(groups[0].textContent).toBe('test_group1');
    expect(groups[1].textContent).toBe('test_group2');
    expect(groups[2].textContent).toBe('test_group3');
});