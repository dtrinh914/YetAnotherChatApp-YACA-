import React from 'react';
import GroupSettingsForm from '../components/GroupSettingsForm';
import {cleanup, render, fireEvent} from '@testing-library/react';

afterEach(cleanup);

const mockFunction = () => {console.log('Triggers')}

test('should render close button that triggers console', ()=>{
    const {getByTestId} = render(<GroupSettingsForm close={mockFunction}/>);
    const spy = jest.spyOn(console, 'log');
    fireEvent.click(getByTestId('group-settings-close'));
    expect(spy).toHaveBeenCalled();
});

test('should open delete menu and return to main menu', () => {
    const {getByTestId, queryByTestId} = render(<GroupSettingsForm close={mockFunction} groupName='test_group' />);
    fireEvent.click(getByTestId('group-settings-delete'));

    expect(getByTestId('group-delete-name').textContent).toContain('test_group');

    fireEvent.click(getByTestId('group-delete-deny'));
    expect(queryByTestId('group-settings-header')).toBeTruthy();
});

test('should open delete menu, confirm delete, and trigger mock function', () => {
    const {getByTestId} = render(<GroupSettingsForm close={mockFunction} deleteGroup={mockFunction} groupName='test_group' />);
    const spy = jest.spyOn(console, 'log');
    fireEvent.click(getByTestId('group-settings-delete'));
    fireEvent.click(getByTestId('group-delete-confirm'));

    //calls twice, once for deleteGroup() which calls close();
    expect(spy).toHaveBeenCalledTimes(2);
});