import React from 'react';
import GroupDescription from '../components/GroupDescription';
import {cleanup, render} from '@testing-library/react';

afterEach(cleanup);

test('should match snapshot', ()=>{
    const {container} = render(<GroupDescription />)
    expect(container).toMatchSnapshot();
});

test('should match second snapshot', ()=>{
    const {container} = render(<GroupDescription description='This group is used for testing.' />)
    expect(container).toMatchSnapshot();
});