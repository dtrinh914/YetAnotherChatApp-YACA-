import React from 'react';
import AddMember from '../components/AddMember';
import {cleanup, fireEvent, render, waitForElement} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axiosMock from 'axios';

afterEach(cleanup);

jest.mock('axios');

const mockFilterResults = (data) => {
    return data;
}
const mockCloseAddMem = () =>{
    console.log('Clicked Away');
}

test('should match snapshot', ()=>{
    const {container} = render(<AddMember filterResults={mockFilterResults} 
                                    closeAddMem={mockCloseAddMem} />);
    expect(container).toMatchSnapshot();
});

test('should fetch data and return list of users', async () => {
    let {getByTestId, getAllByTestId} = render(<AddMember filterResults={mockFilterResults} 
                                    closeAddMem={mockCloseAddMem} />);
    const addMemberInput = getByTestId('addmember-input');
    const addMemberSubmitButton = getByTestId('addmember-submit-button');

    //user enters text into search input
    fireEvent.change(addMemberInput, {target: {value: 'test_user'}});
    expect(addMemberInput.value).toBe('test_user');

    const mockData = [
                        {_id: "5e28c5c185ffc434b337c266", username: "test_user1", status:'active'},
                        {_id: "5e28c5bc85ffc434b337c264", username: "test_user2", status:'pending'},
                        {_id: "5e28c5c485ffc434b337c268", username: "test_user3", status:'add'}
                     ];
    axiosMock.get.mockResolvedValueOnce({data: {data:mockData, status:1}});

    //user submits entry
    fireEvent.click(addMemberSubmitButton);

    const members = await waitForElement(()=> getAllByTestId('member-result-card'));

    //check to see if data is properly fetched
    expect(axiosMock.get).toHaveBeenCalledTimes(1);
    expect(axiosMock.get).toHaveBeenCalledWith('/api/users/search/test_user', {withCredentials:true});

    //check to see that result contains three items
    expect(members.length).toBe(3);
});