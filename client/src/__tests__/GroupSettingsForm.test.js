import React from 'react';
import GroupSettingsForm from '../components/GroupSettingsForm';
import {cleanup, render, fireEvent} from '@testing-library/react';

afterEach(cleanup);

const mockFunction = () => {console.log('Triggers')};
const component = <GroupSettingsForm close={mockFunction} deleteGroup={mockFunction} editGroup={mockFunction}
                    groupName='test_group' groupDescription='test_description' />

test('should render close button that triggers console', ()=>{
    const {getByTestId} = render(component);
    const spy = jest.spyOn(console, 'log');
    fireEvent.click(getByTestId('group-settings-close'));
    expect(spy).toHaveBeenCalled();
});

test('should open delete menu and return to main menu', () => {
    const {getByTestId, queryByTestId} = render(component);
    fireEvent.click(getByTestId('group-settings-delete'));

    expect(getByTestId('group-delete-name').textContent).toContain('test_group');

    fireEvent.click(getByTestId('group-delete-deny'));
    expect(queryByTestId('group-settings-header')).toBeTruthy();
});

test('should open delete menu, confirm delete, and trigger mock function', () => {
    const {getByTestId} = render(component);
    const spy = jest.spyOn(console, 'log');
    fireEvent.click(getByTestId('group-settings-delete'));
    fireEvent.click(getByTestId('group-delete-confirm'));

    //calls twice, once for deleteGroup() which calls close();
    expect(spy).toHaveBeenCalledTimes(2);
});

test('should open edit menu and go back to main menu', async () => {
    const {getByTestId, queryByTestId} = render(component);
    fireEvent.click(getByTestId('group-settings-editgroup'));

    expect(getByTestId('group-edit-name').value).toBe('test_group');
    expect(getByTestId('group-edit-description').value).toBe('test_description');

    fireEvent.click(getByTestId('group-edit-back'));

    expect(queryByTestId('group-settings-header')).toBeTruthy();
});

test('should open edit menu, change description, confirm, and trigger mock function', () => {
    const {getByTestId} = render(component);
    const spy = jest.spyOn(console, 'log');

    fireEvent.click(getByTestId('group-settings-editgroup'));
    const descriptionInput = getByTestId('group-edit-description');

    expect(descriptionInput.value).toBe('test_description');
    fireEvent.change(descriptionInput, {target: {value:'new_description'}});
    expect(descriptionInput.value).toBe('new_description');

    fireEvent.click(getByTestId('group-edit-confirm'));
    expect(spy).toHaveBeenCalled();
});