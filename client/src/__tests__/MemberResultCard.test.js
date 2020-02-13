import React from 'react';
import MemberResultCard from '../components/MemberResultCard';
import {cleanup, getByTestId, fireEvent, render} from '@testing-library/react';

afterEach(cleanup);

describe('<MemberResultCard /> with an active member', ()=>{
    it('should match snapshot', ()=>{
        const {container} = render(<MemberResultCard username='test_user' status='active' />);
        expect(container).toMatchSnapshot();
    })
});

describe('<MemberResultCard /> with a pending member', ()=>{
    it('should match snapshot', ()=>{
        const {container} = render(<MemberResultCard username='test_user' status='pending' />)
        expect(container).toMatchSnapshot();
    })
});

describe('<MemberResultCard /> with any other person', ()=>{
    const mockSendInvite = () => {console.log('Triggered')};

    it('should match snapshot', ()=>{
        const {container} = render(<MemberResultCard username='test_user' 
                                    userId='test_id' status='add' sendInvite={mockSendInvite} />)
        expect(container).toMatchSnapshot();
    })

    it('should trigger the sendInvite function',()=>{
        const {container} = render(<MemberResultCard username='test_user' 
                                    userId='test_id' status='add' sendInvite={mockSendInvite} />)
        const addButton = getByTestId(container, 'add-button');
        const spy = jest.spyOn(console, 'log');
        
        fireEvent.click(addButton);
        expect(spy).toHaveBeenCalled();
    });
});