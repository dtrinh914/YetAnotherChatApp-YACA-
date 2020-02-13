import React from 'react';
import ChatPage from '../views/ChatPage';
import INIT_SEED_DATA from '../util/INIT_SEED_DATA';
import MOCK_GROUP_DATA from '../util/MOCK_GROUP_DATA';
import {BrowserRouter} from 'react-router-dom';
import {ChatProvider} from '../contexts/chatContext';
import {NavProvider} from '../contexts/navContext';
import {render, cleanup, wait, fireEvent, getByTestId} from '@testing-library/react';
import {createMuiTheme} from '@material-ui/core/styles';
import {MuiThemeProvider} from '@material-ui/core/styles';
import axiosMock from 'axios';

const component = <BrowserRouter>
                  <NavProvider>
                  <ChatProvider>
                     <ChatPage loggedIn={true} setUserData={()=>{console.log('Triggered')}} />
                  </ChatProvider>
                  </NavProvider>
                  </BrowserRouter>;

const seedData = INIT_SEED_DATA;

jest.mock('popper.js');
afterEach(cleanup);

describe('<ChatPage/> when the screen size is large', ()=>{
    afterEach(cleanup);
    const theme = createMuiTheme({props:{MuiWithWidth: {initialWidth:'lg'}}});

    it('should toggle right nav when the toggle button is clicked', async () =>{
        //get init user data
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {queryByTestId} = render(<MuiThemeProvider theme={theme}>
                                            {component}
                                       </MuiThemeProvider>);
        await wait(()=>{
            expect(queryByTestId('left-nav')).toBeTruthy();
            expect(queryByTestId('right-nav')).toBeTruthy();
        });
    
        //click button to toggle right nav
        fireEvent.click(queryByTestId('nav-toggle-right'));
        //right nav should be hidden
        expect(queryByTestId('right-nav').className).toContain('hidden');
    
        fireEvent.click(queryByTestId('nav-toggle-right'));
        //right nav should be unhidden
        expect(queryByTestId('right-nav').className).not.toContain('hidden');
    });

    it('should enter new message in Chat Window', async () =>{
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {queryByTestId, queryAllByTestId} = render(<MuiThemeProvider theme={theme}>
                                                                {component}
                                                         </MuiThemeProvider>);
        await wait(()=>{
            //should start off with three messages
            expect(queryAllByTestId('message').length).toBe(4);
        });

        //enter new message into chat input 
        fireEvent.change(queryByTestId('message-input'), {target:{value:'This is a new message.'}});
        //send message
        fireEvent.click(queryByTestId('send-button'));

        const newMessages = queryAllByTestId('message');
        expect(newMessages.length).toBe(5);
        expect(newMessages[4].textContent).toContain('This is a new message.');
    });

    it('should change the current group', async () =>{
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {queryByTestId, queryAllByTestId} = render(<MuiThemeProvider theme={theme}>
                                                                {component}
                                                         </MuiThemeProvider>);
        await wait(()=>{
            //should start off on test_group1 
            expect(queryByTestId('nav-group-name').textContent).toBe('test_group1');
            //should be 4 messages in this group
            expect(queryAllByTestId('message').length).toBe(4);
        });

        const groupTabs = queryAllByTestId('group-tab-button');
        expect(groupTabs.length).toBe(2);

        //click test_group2 group tab
        fireEvent.click(groupTabs[1]);
        
        expect(queryByTestId('nav-group-name').textContent).toBe('test_group2');
        expect(queryAllByTestId('message').length).toBe(3);
    });

    it('should accept invite and add to group list', async () =>{
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {queryAllByTestId} = render(<MuiThemeProvider theme={theme}>
                                                                {component}
                                                         </MuiThemeProvider>);
        await wait(()=>{
            //should start off with 2 groups in the group list
            expect(queryAllByTestId('group-tab-button').length).toBe(2);
        });

        //should start off with 3 group invites
        const groupInvites = queryAllByTestId('group-invite-item');
        expect(groupInvites.length).toBe(3);

        axiosMock.post.mockResolvedValueOnce({data:{status:1}});
        axiosMock.get.mockResolvedValueOnce(MOCK_GROUP_DATA);
        //click accept on first group invite
        fireEvent.click(getByTestId(groupInvites[0], 'group-invite-accept'));

        await wait(()=>{
            expect(queryAllByTestId('group-invite-item').length).toBe(2);
        });

        const newGroups = queryAllByTestId('group-tab-button');
        expect(newGroups.length).toBe(3);
        expect(newGroups[2].textContent).toContain('mock_group');
    });

    it('should decline invite', async () =>{
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {queryAllByTestId} = render(<MuiThemeProvider theme={theme}>
                                                                {component}
                                                         </MuiThemeProvider>);
        await wait(()=>{
            //should start off with 2 groups in the group list
            expect(queryAllByTestId('group-tab-button').length).toBe(2);
        });

        //should start off with 3 group invites
        const groupInvites = queryAllByTestId('group-invite-item');
        expect(groupInvites.length).toBe(3);

        axiosMock.delete.mockResolvedValueOnce({data:{status:1}});
        //click decline on first group invite
        fireEvent.click(getByTestId(groupInvites[0], 'group-invite-decline'));

        await wait(()=>{
            expect(queryAllByTestId('group-invite-item').length).toBe(2);
        });

        expect(queryAllByTestId('group-tab-button').length).toBe(2);
    });

    it('should create new group', async () => {
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {queryByTestId, queryAllByTestId} = render(<MuiThemeProvider theme={theme}>
                                                                {component}
                                                         </MuiThemeProvider>);
        await wait(()=>{
            //should start off with 2 groups in the group list
            expect(queryAllByTestId('group-tab-button').length).toBe(2);
        });

        fireEvent.click(queryByTestId('add-group-button'));
        fireEvent.change(queryByTestId('newgroupform-group-name-input'), {target:{value:'mock_group'}});

        axiosMock.post.mockResolvedValueOnce(MOCK_GROUP_DATA);
        fireEvent.click(queryByTestId('newgroupform-submit'));

        await wait(()=>{
            expect(queryAllByTestId('group-tab-button').length).toBe(3);
        });
    });

    it('should open add member container', async () => {
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {queryByTestId} = render(<MuiThemeProvider theme={theme}>
                                            {component}
                                        </MuiThemeProvider>);
        await wait(()=>{
            expect(queryByTestId('addmember-form')).toBeNull();
        });

        fireEvent.click(queryByTestId('nav-addmem'));
        expect(queryByTestId('addmember-form')).toBeTruthy();
    })
})

describe('<ChatPage/> when the screen size is small', ()=>{
    afterEach(cleanup);
    const theme = createMuiTheme({props:{MuiWithWidth: {initialWidth:'sm'}}});

    it('should render properly and open right drawer', async () =>{
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {queryByTestId} = render(<MuiThemeProvider theme={theme}>
                                            {component}
                                       </MuiThemeProvider>);
        await wait(()=>{
            expect(queryByTestId('left-nav')).toBeTruthy();
            expect(queryByTestId('right-nav')).toBeNull();
            expect(queryByTestId('nav-config')).toBeTruthy();
            expect(queryByTestId('right-nav-drawer')).toBeNull();
        });
    
        //click on right nav config icon
        fireEvent.click(queryByTestId('nav-config'));
        //click on group info tab
        fireEvent.click(queryByTestId('nav-config-group-info'));
        //should open up the right drawer
        expect(queryByTestId('right-nav-drawer')).toBeTruthy();
    });

    it('should open add member container', async () =>{
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {queryByTestId} = render(<MuiThemeProvider theme={theme}>
                                            {component}
                                       </MuiThemeProvider>);
        await wait(()=>{
            expect(queryByTestId('addmember-form')).toBeNull();
        });
    
        //click on right nav config icon
        fireEvent.click(queryByTestId('nav-config'));
        //click on group info tab
        fireEvent.click(queryByTestId('nav-config-addmem'));
        //should open up the right drawer
        expect(queryByTestId('addmember-form')).toBeTruthy();
    });
});

describe('<ChatPage/> when the screen size is extra small', ()=>{
    afterEach(cleanup);
    const theme = createMuiTheme({props:{MuiWithWidth: {initialWidth:'xs'}}});

    it('should render properly and open left drawer', async () =>{
        axiosMock.get.mockResolvedValueOnce(seedData);

        const {queryByTestId} = render(<MuiThemeProvider theme={theme}>
                                            {component}
                                       </MuiThemeProvider>);
        await wait(()=>{
            expect(queryByTestId('nav-group-nav')).toBeTruthy();
            expect(queryByTestId('left-nav')).toBeNull();
            expect(queryByTestId('left-drawer')).toBeNull();
            expect(queryByTestId('right-nav')).toBeNull();
        });
        
        fireEvent.click(queryByTestId('nav-group-nav'));
        expect(queryByTestId('left-drawer')).toBeTruthy();
    });
});



