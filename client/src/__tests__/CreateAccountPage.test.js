import React from 'react';
import CreateAccountPage from '../views/CreateAccountPage';
import {BrowserRouter} from 'react-router-dom';
import {cleanup, render, fireEvent, wait} from '@testing-library/react';
import axiosMock from 'axios';

const mockFunction = () => console.log('Triggered');

const component = <BrowserRouter><CreateAccountPage logInUser={mockFunction} /></BrowserRouter>;

afterEach(cleanup);

describe('CreateAccountPage component after each input', ()=>{
    afterEach(cleanup);

    it.each`
        username                     | result
        ${'test user'}               | ${'The username cannot contain any spaces.'}
        ${' test_user'}              | ${'The username cannot contain any spaces.'}
        ${' test_user '}             | ${'The username cannot contain any spaces.'}
        ${'a'}                       | ${'The username needs to be at least 3 characters.'}
        ${'reallylongtest_user_name'}| ${'The username cannot be longer than 15 characters.'}
    `('should return $result when username = $username', ({username, result})=>{
        const {getByTestId} = render(component);
        fireEvent.change(getByTestId('create-page-username-input'), {target:{value:username}});
        expect(getByTestId('create-page-username-helper').textContent).toBe(result);
    });

    it.each`
        password                                    | result
        ${'abc123'}                                 | ${'The password needs to be at least 8 characters.'}
        ${' abcd1234'}                              | ${'The password cannot contain any spaces.'}
        ${'abcd1234 '}                              | ${'The password cannot contain any spaces.'}
        ${'abc d123 4'}                             | ${'The password cannot contain any spaces.'}
        ${'thisisthelongestpasswordinthewholeworld'}| ${'The password cannot be more than 32 characters.'}
    `('should return $result when password = $password', ({password, result})=>{
        const {getByTestId} = render(component);
        fireEvent.change(getByTestId('create-page-password-input'), {target:{value:password}});
        expect(getByTestId('create-page-password-helper').textContent).toBe(result);
    });

    it('should have message "Passwords need to match."', ()=>{
        const {getByTestId} = render(component);
        fireEvent.change(getByTestId('create-page-password-input'), {target:{value:'abcd1234'}});
        fireEvent.change(getByTestId('create-page-confirm-input'), {target:{value:'1234abcd'}});

        expect(getByTestId('create-page-confirm-helper').textContent).toBe('Passwords need to match.');
    });
});

test('should create user and trigger log in function', async () =>{
    const {getByTestId, queryByTestId} = render(component);
    const spy = jest.spyOn(console, 'log');

    //loading bar should not be on page
    expect(queryByTestId('create-page-loading')).toBeNull();

    //fill out form
    fireEvent.change(getByTestId('create-page-username-input'), {target:{value:'test_user'}});
    fireEvent.change(getByTestId('create-page-password-input'), {target:{value:'1234abcd'}});
    fireEvent.change(getByTestId('create-page-confirm-input'),  {target:{value:'1234abcd'}});

    axiosMock.post.mockResolvedValueOnce({data:{status:1}});

    await wait(()=>{
        //press submit button
        fireEvent.click(getByTestId('create-page-submit'));
        //loading bar should appear
        expect(queryByTestId('create-page-loading')).toBeTruthy();
    });

    await wait(()=>{
        //loading bar should be gone 
        expect(queryByTestId('create-page-loading')).toBeNull();
        expect(spy).toHaveBeenCalled();
    })

});

test('should attempt to create user and return error message "This username has already been taken."', async () =>{
    const {getByTestId} = render(component);

    //fill out form
    fireEvent.change(getByTestId('create-page-username-input'), {target:{value:'test_user'}});
    fireEvent.change(getByTestId('create-page-password-input'), {target:{value:'1234abcd'}});
    fireEvent.change(getByTestId('create-page-confirm-input'),  {target:{value:'1234abcd'}});

    axiosMock.post.mockResolvedValueOnce({data:{status:0}});

    fireEvent.click(getByTestId('create-page-submit'));

    await wait(()=>{
        expect(getByTestId('create-page-username-helper').textContent).toBe('This username has already been taken.');
    })
});

