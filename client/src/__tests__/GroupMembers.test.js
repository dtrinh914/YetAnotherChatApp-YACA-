import React from 'react';
import {cleanup, render, getAllByTestId} from '@testing-library/react';
import GroupMembers from '../components/GroupMembers';
import '@testing-library/jest-dom/extend-expect';

const seedData = [
                    {_id: "5e28c5c185ffc434b337c266", username: "test_user1"},
                    {_id: "5e28c5bc85ffc434b337c264", username: "test_user2"},
                    {_id: "5e28c5c485ffc434b337c268", username: "test_user3"},
                    {_id: "5e28c5c385ffc434b337c267", username: "test_user4"}
                 ];

afterEach(cleanup);

describe('GroupMember component with no data', () => {
    it('should match snapshot', ()=>{
        const {container} = render(<GroupMembers groupMembers={[]} />);
        expect(container).toMatchSnapshot();
    });
})

describe('GroupMember component with seedData', ()=>{
    const {container} = render(<GroupMembers groupMembers={seedData} />);
    const listItems = getAllByTestId(container, 'group-member');

    it('should match snapshot 2', () => {
        expect(container).toMatchSnapshot();
    });

    it('should return 4 list items', () => {
        expect(listItems.length).toBe(4);
    });

    it('should return list items with proper names',()=>{
        expect(listItems[0]).toHaveTextContent('test_user1');
        expect(listItems[1]).toHaveTextContent('test_user2');
        expect(listItems[2]).toHaveTextContent('test_user3');
        expect(listItems[3]).toHaveTextContent('test_user4');
    });
})


