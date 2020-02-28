import React from 'react';
import LoginPage from '../views/LoginPage';
import {cleanup, render, fireEvent, wait} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axiosMock from 'axios';

afterEach(cleanup);

const mockFunction = () => console.log();
const component = <BrowserRouter><LoginPage loggedIn={false} setLoggedIn={mockFunction}/></BrowserRouter>

test('should login properly', async () => {
    const {getByTestId, queryByTestId} = render(component);
    //set username and password
    fireEvent.change(getByTestId('loginpage-username'),{target:{value:'test_user'}});
    fireEvent.change(getByTestId('loginpage-password'),{target:{value:'test_password'}});
    
    expect(getByTestId('loginpage-username').value).toBe('test_user');
    expect(getByTestId('loginpage-password').value).toBe('test_password');

    axiosMock.post.mockResolvedValueOnce({data:{loggedIn: true}})
    const spy = jest.spyOn(console, 'log');

    await wait(()=>{
        //submit form
        fireEvent.click(getByTestId('loginpage-submit'));
        //loading bar should appear
        expect(queryByTestId('loginpage-loading')).toBeTruthy();
    });

    await wait(()=>{
        //loading bar should disappear
        expect(queryByTestId('loginpage-loading')).toBeNull();
        expect(spy).toHaveBeenCalled();
    });
});

test('should not login and return error message', async () => {
    const {getByTestId, queryByTestId} = render(component);
    //set username and password
    fireEvent.change(getByTestId('loginpage-username'),{target:{value:'test_user'}});
    fireEvent.change(getByTestId('loginpage-password'),{target:{value:'wrong_password'}});

    axiosMock.post.mockResolvedValueOnce({data:{loggedIn: false}})
    fireEvent.click(getByTestId('loginpage-submit'));

    await wait(()=>{
        expect(getByTestId('loginpage-username-helper').textContent).toBe('Username and/or password does not match.');
    });
});