import React from 'react';
import NewGroupForm from '../components/NewGroupForm';
import {cleanup, render,fireEvent, wait} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

const mockClose = () => {
    console.log('Triggered');
}

test('should have form with group name = "test_group" and group description = "test_description" ', ()=>{
    const {getByTestId} = render(<NewGroupForm />);
    const groupNameInput = getByTestId('newgroupform-group-name-input');
    const groupDescriptionInput = getByTestId('newgroupform-group-description-input');

    fireEvent.change(groupNameInput, {target:{value:'test_group'}});
    fireEvent.change(groupDescriptionInput, {target:{value:'test_description'}});

    expect(groupNameInput.value).toBe('test_group');
    expect(groupDescriptionInput.value).toBe('test_description');
});

test('should return a close button that triggers a console.log', ()=>{
    //mocks the functionality of the close button
    const {getByTestId, queryByTestId} = render(<NewGroupForm close={mockClose} />);
    const spy = spyOn(console, 'log');

    fireEvent.click(getByTestId('newgroupform-close'));
    expect(spy).toHaveBeenCalled();
});

test('should return loading bar after submit and the trigger close function', async ()=>{
    const {getByTestId, queryByTestId} = render(<NewGroupForm createNewGroup={()=>Promise.resolve(1)} close={mockClose} />);
    const groupNameInput = getByTestId('newgroupform-group-name-input');
    const submitButton = getByTestId('newgroupform-submit');
    const closeButton = getByTestId('newgroupform-close');
    const spy = spyOn(console, 'log');

    fireEvent.change(groupNameInput, {target:{value:'test_group'}});
    
    //check to see if loading bar is rendered after clicking submit
    await wait(() => {
        fireEvent.click(submitButton);
        expect(queryByTestId('newgroupform-loading')).toBeTruthy();

        //both submit and close button should be disabled
        expect(submitButton).toHaveAttribute('disabled');
        expect(closeButton).toHaveAttribute('disabled');
    });

    //loading bar should be gone after data is returned
    await wait(()=>{
        expect(queryByTestId('newgroupform-loading')).not.toBeInTheDocument();

        //both submit and close button should be enabled again
        expect(submitButton).not.toHaveAttribute('disabled');
        expect(closeButton).not.toHaveAttribute('disabled');
    });

    //the form close() function should be called;
    expect(spy).toHaveBeenCalled();
});

test('should display "This field is required." if an empty group name is submitted', ()=>{
    const {getByTestId} = render(<NewGroupForm />);
    fireEvent.click(getByTestId('newgroupform-submit'));

    expect(getByTestId('newgroupform-group-name-error').textContent).toBe('This field is required.')
});

test.each`
    resolvedValue | result
    ${0}         | ${"A group with this name already exists."}
    ${-1}        | ${"An error occured while processing your request."}  
`('should display $results when resolvedValue = $resolvedValue', async ({resolvedValue, result})=>{
    const {getByTestId} = render(<NewGroupForm createNewGroup={()=>Promise.resolve(resolvedValue)} close={mockClose} />);
    const groupNameInput = getByTestId('newgroupform-group-name-input');
    const spy = spyOn(groupNameInput, 'focus');

    fireEvent.change(groupNameInput, {target:{value:'test_group'}});

    fireEvent.click(getByTestId('newgroupform-submit'));

    await wait(()=>{
        expect(getByTestId('newgroupform-group-name-error').textContent).toBe(result);
        expect(spy).toHaveBeenCalled();
    })
});



