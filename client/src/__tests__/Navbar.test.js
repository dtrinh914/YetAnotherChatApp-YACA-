import React from 'react';
import Navbar from '../components/Navbar';
import { ChatProvider } from '../contexts/chatContext';
import { NavProvider} from '../contexts/navContext';
import {render} from '@testing-library/react';

test('should match snapshot', ()=>{
    const {container} = render(<ChatProvider>
                             <NavProvider>
                                <Navbar />       
                             </NavProvider>
                             </ChatProvider>);
    expect(container).toMatchSnapshot();
})