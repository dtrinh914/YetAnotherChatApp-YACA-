import React from 'react';
import GroupInviteItem from '../components/GroupInviteItem';
import {cleanup, render, fireEvent} from '@testing-library/react';

afterEach(cleanup);

test('should render empty component', ()=>{
    const {getByTestId} = render(<GroupInviteItem />);
    expect(getByTestId('group-invite-name').textContent).toBe('');
});

test('should render component with name = "test_group"', ()=>{
    const {getByTestId} = render(<GroupInviteItem groupName='test_group' />);
    expect(getByTestId('group-invite-name').textContent).toBe('test_group');
});

test('should trigger console.log when accept button is clicked', ()=>{
    const {getByTestId} = render(<GroupInviteItem acceptInvite={()=>{console.log('Triggered')}} />);
    const spy = jest.spyOn(console, 'log');
    const acceptButton = getByTestId('group-invite-accept'); 

    fireEvent.click(acceptButton);

    expect(spy).toHaveBeenCalled();
});

test('should trigger console.log when accept button is clicked', ()=>{
    const {getByTestId} = render(<GroupInviteItem declineInvite={()=>{console.log('Triggered')}} />);
    const spy = jest.spyOn(console, 'log');
    const declineButton = getByTestId('group-invite-decline'); 

    fireEvent.click(declineButton);

    expect(spy).toHaveBeenCalled();
});