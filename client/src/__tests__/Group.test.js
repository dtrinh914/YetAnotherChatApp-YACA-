import React from 'react';
import Group from '../components/Group';
import {cleanup, render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

test('should render an empty component', ()=>{
    const {getByTestId} = render(<Group />);
    expect(getByTestId('group-tab-name')).toHaveTextContent('');
});

test('should render a component with group name of test_group', ()=>{
    const {getByTestId} = render(<Group name='test_group' />);
    expect(getByTestId('group-tab-name')).toHaveTextContent('test_group');
});

test('should trigger console.log when clicked', ()=>{
    const {getByTestId} = render(<Group name='test_group' setGroup={()=>{console.log('Triggered')}} />);
    const groupTabButton = getByTestId('group-tab-button');

    const spy = jest.spyOn(console, 'log');
    fireEvent.click(groupTabButton);

    expect(spy).toHaveBeenCalled();
})