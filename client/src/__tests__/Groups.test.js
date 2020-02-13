import React from 'react';
import Groups from '../components/Groups';
import {cleanup, render, fireEvent} from '@testing-library/react';

afterEach(cleanup);

test('should return empty list', ()=>{
    const {getByTestId} = render(<Groups groups={[]} />);
    expect(getByTestId('group-list').children.length).toBe(0);
});

test('should return a list with three elements', ()=>{
    const seedData = [
                        {id:12345, name:'test_group1'},
                        {id:67890, name:'test_group2'},
                        {id:13579, name:'test_group3'}
                     ]
    const {getByTestId} = render(<Groups groups={seedData}/>);
    const groups = getByTestId('group-list').children;

    expect(groups.length).toBe(3);
    expect(groups[0].textContent).toBe('test_group1');
    expect(groups[1].textContent).toBe('test_group2');
    expect(groups[2].textContent).toBe('test_group3');
});

test('should trigger a console log when the add button is clicked', ()=>{
    const {getByTestId} = render(<Groups groups={[]} openNewGroup={()=>{console.log('Triggered')}}/>);
    const addGroupButton = getByTestId('add-group-button');
    const spy = jest.spyOn(console,'log');

    fireEvent.click(addGroupButton);
    expect(spy).toHaveBeenCalled();
});