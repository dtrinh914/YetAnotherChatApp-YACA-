import React from 'react';
import UserCard from '../components/UserCard';
import {cleanup, render} from '@testing-library/react';

afterEach(cleanup);

test('should render an empty component', ()=>{
    const {getByTestId} = render(<UserCard username='' />);
    expect(getByTestId('usercard-username').textContent).toBe('');
});

test('should render component with username = "test_user"',()=>{
    const {getByTestId} = render(<UserCard username='test_user' />);
    expect(getByTestId('usercard-username').textContent).toBe('test_user');
});