import React from 'react';
import ChatPage from '../views/ChatPage';
import mockData from '../util/mockData';
import {BrowserRouter} from 'react-router-dom';
import {ChatProvider} from '../contexts/chatContext';
import {NavProvider} from '../contexts/navContext';
import {render, cleanup, wait, fireEvent, getByTestId} from '@testing-library/react';
import {createMuiTheme} from '@material-ui/core/styles';
import {MuiThemeProvider} from '@material-ui/core/styles';
import axiosMock from 'axios';
import { SocketIO, Server } from 'mock-socket';

const fakeURL = 'ws://localhost:8080';
let mockServer;

const genComponent = (theme) =>{
    return(
        <MuiThemeProvider theme={theme}>
        <BrowserRouter>
        <NavProvider>
        <ChatProvider>
            <ChatPage io={SocketIO} url={fakeURL} loggedIn={true} setUserData={()=>{console.log('Triggered')}} />
        </ChatProvider>
        </NavProvider>
        </BrowserRouter>
        </MuiThemeProvider>
    );
}

const seedData = mockData.seedData;
const mockGroupData = mockData.newGroupData;

jest.mock('popper.js');
beforeEach(()=>{
   mockServer = new Server(fakeURL);
});

afterEach(()=>{
    cleanup;
    mockServer.stop();
});

describe('<ChatPage/> when the screen size is large', ()=>{
    afterEach(cleanup);
    const theme = createMuiTheme({props:{MuiWithWidth: {initialWidth:'lg'}}});
    const component = genComponent(theme);

    it('should display welcome page and open new group form', async()=>{
        axiosMock.get.mockResolvedValueOnce(mockData.cleanSeedData);
        const {queryByTestId} = render(component);

        await wait(()=>{
            expect(queryByTestId('newgroupform')).toBeNull();
            expect(queryByTestId('welcome-container')).toBeTruthy();
        });

        fireEvent.click(queryByTestId('welcome-newgroup-button'));
        expect(queryByTestId('newgroupform')).toBeTruthy();
    });

    it('should toggle right nav when the toggle button is clicked', async () =>{
        //get init user data
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {queryByTestId} = render(component);

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
        const {queryByTestId, queryAllByTestId} = render(component);

        //setup to check if client sends message to server
        let received = 0;
        mockServer.on('message', () =>{
            received++;
        });

        await wait(()=>{
            //should start off with four messages
            expect(queryAllByTestId('message').length).toBe(4);
        });

        //enter new message into chat input 
        fireEvent.change(queryByTestId('message-input'), {target:{value:'This is a new message.'}});
        //send message
        fireEvent.click(queryByTestId('send-button'));

        const newMessages = queryAllByTestId('message');
        expect(newMessages.length).toBe(5);
        expect(newMessages[4].textContent).toContain('This is a new message.');

        await wait(()=>{
            expect(received).toBe(1);
        });
    });

    it('should change the current group', async () =>{
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {queryByTestId, queryAllByTestId} = render(component);

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
        const {queryAllByTestId} = render(component);

        await wait(()=>{
            //should start off with 2 groups in the group list
            expect(queryAllByTestId('group-tab-button').length).toBe(2);
        });

        //should start off with 3 group invites
        const groupInvites = queryAllByTestId('group-invite-item');
        expect(groupInvites.length).toBe(3);

        //setup to check if client sends message to server
        let received = 0;
        mockServer.on('update_memberlist', (groupId) =>{
            if(groupId === mockGroupData.data.data[0]._id)received++;
        });

        axiosMock.post.mockResolvedValueOnce({data:{status:1}});
        axiosMock.get.mockResolvedValueOnce(mockGroupData);
        //click accept on first group invite
        fireEvent.click(getByTestId(groupInvites[0], 'group-invite-accept'));

        await wait(()=>{
            expect(queryAllByTestId('group-invite-item').length).toBe(2);
            expect(received).toBe(1);

            const newGroups = queryAllByTestId('group-tab-button');
            expect(newGroups.length).toBe(3);
            expect(newGroups[2].textContent).toContain('mock_group');
        });

       
    });

    it('should decline invite', async () =>{
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {queryAllByTestId} = render(component);

        await wait(()=>{
            //should start off with 2 groups in the group list
            expect(queryAllByTestId('group-tab-button').length).toBe(2);
        });

        //should start off with 3 group invites
        const groupInvites = queryAllByTestId('group-invite-item');
        expect(groupInvites.length).toBe(3);

         //setup to check if client sends message to server
         let received = 0;
         mockServer.on('update_memberlist', (groupId) =>{
             if(groupId === mockGroupData.data.data[0]._id)received++;
         });

        axiosMock.delete.mockResolvedValueOnce({data:{status:1}});
        //click decline on first group invite
        fireEvent.click(getByTestId(groupInvites[0], 'group-invite-decline'));

        await wait(()=>{
            expect(queryAllByTestId('group-invite-item').length).toBe(2);
            expect(received).toBe(1);
        });

        expect(queryAllByTestId('group-tab-button').length).toBe(2);
    });

    it('should create new group', async () => {
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {queryByTestId, queryAllByTestId} = render(component);

        await wait(()=>{
            //should start off with 2 groups in the group list
            expect(queryAllByTestId('group-tab-button').length).toBe(2);
        });

        fireEvent.click(queryByTestId('add-group-button'));
        fireEvent.change(queryByTestId('newgroupform-group-name-input'), {target:{value:'mock_group'}});

        //setup to check if client sends message to server
        let received = 0;
        mockServer.on('join_room', (roomId) =>{
            if(roomId === mockGroupData.data.data[0]._id)received++;
        });

        axiosMock.post.mockResolvedValueOnce(mockGroupData);
        fireEvent.click(queryByTestId('newgroupform-submit'));

        await wait(()=>{
            expect(received).toBe(1);
            expect(queryAllByTestId('group-tab-button').length).toBe(3);
        });
    });

    it('should change the group description', async () => {
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {getByTestId, queryByTestId} = render(component);
        
        await wait(()=> {
            //should have group settings icon
            expect(getByTestId('group-description').textContent).toBe('A description of test_group1');
            expect(queryByTestId('nav-groupsettings')).toBeTruthy();
        });

        //open group settings menu, click edit group description button
        fireEvent.click(getByTestId('nav-groupsettings'));
        fireEvent.click(getByTestId('group-settings-editgroup'));

         //setup to check if client sends message to server
         let received = 0;
         const newDescription = 'Changed the description.';

         mockServer.on('update_group', (groupId, groupDescription) =>{
             const id = seedData.data.groups[0]._id;
             if(groupId === id && groupDescription === newDescription)received++;
         });

        //change group description and confirm change
        axiosMock.put.mockResolvedValueOnce({data:{status:1}});
        fireEvent.change(getByTestId('group-edit-description'), {target:{value:newDescription}});
        fireEvent.click(getByTestId('group-edit-confirm'));
        
        await wait(()=>{
            expect(received).toBe(1);
            expect(getByTestId('group-description').textContent).toBe(newDescription);
        });
    });

    it('should delete group', async () => {
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {getByTestId, queryByTestId, queryAllByTestId} = render(component);
        
        await wait(()=> {
            //should have group settings icon
            expect(queryByTestId('nav-groupsettings')).toBeTruthy();
            expect(queryAllByTestId('group-tab-button').length).toBe(2);
        });

        //setup to check if client sends message to server
        let received = 0;
        mockServer.on('remove_group', (groupId) =>{
            const id = seedData.data.groups[0]._id;
            if(groupId === id)received++;
        });

        axiosMock.delete.mockResolvedValueOnce({data:{status:1}});

        //open group settings menu, click delete, and confirm
        fireEvent.click(getByTestId('nav-groupsettings'));
        fireEvent.click(getByTestId('group-settings-delete'));
        fireEvent.click(getByTestId('group-delete-confirm'));

        await wait(()=>{
            expect(received).toBe(1);
            expect(queryAllByTestId('group-tab-button').length).toBe(1);
        })
    });

    it('should delete one member', async() => {
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {getByTestId, queryByTestId, queryAllByTestId} = render(component);

        await wait(()=> {
            //should have group settings icon
            expect(queryByTestId('nav-groupsettings')).toBeTruthy();
        });

        fireEvent.click(getByTestId('nav-groupsettings'));
        fireEvent.click(getByTestId('group-settings-editmembers'));

        const checkBoxes = queryAllByTestId('memberlistitem-checkbox');

        expect(checkBoxes.length).toBe(2);

        //setup to check if client sends message to server
        let received = 0;
        mockServer.on('update_memberlist', (groupId) =>{
            const id = seedData.data.groups[0]._id;
            if(groupId === id)received++;
        });

        
        axiosMock.delete.mockResolvedValueOnce({data:{status:1}});

        fireEvent.click(checkBoxes[0]);
        fireEvent.click(getByTestId('group-editmembers-confirm'));

        await wait(()=>{
            expect(received).toBe(1);
        });
    });

    it('should open second group tab and leave group', async() => {
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {getByTestId, queryAllByTestId} = render(component);

        await wait(()=> {
            //should have 2 groups in group tabs
            expect(queryAllByTestId('group-tab-button').length).toBe(2);
        });

        //click on 2nd group tab
        fireEvent.click(queryAllByTestId('group-tab-button')[1]);
        //click leave group button on nav
        fireEvent.click(getByTestId('nav-leavegroup'));

        //setup to check if client sends message to server
        let received = 0;
        mockServer.on('update_memberlist', (groupId) =>{
            const id = seedData.data.groups[1]._id;
            if(groupId === id)received++;
        });

        axiosMock.delete.mockResolvedValueOnce({data:{status:1}});
        //click confirm
        fireEvent.click(getByTestId('confirmation-confirm'));

        await wait(()=>{
            //should only have one group
            expect(queryAllByTestId('group-tab-button').length).toBe(1);
            expect(received).toBe(1);
        });
    })

    it('should open add member container', async () => {
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {queryByTestId} = render(component);

        await wait(()=>{
            expect(queryByTestId('addmember-form')).toBeNull();
        });

        fireEvent.click(queryByTestId('nav-addmem'));
        expect(queryByTestId('addmember-form')).toBeTruthy();
    });

    it('should receive and display new message', async () => {
        axiosMock.get.mockResolvedValueOnce(seedData);
    
        const {queryAllByTestId} = render(component);

        await wait(()=>{
            //should start off with four messages
            expect(queryAllByTestId('message').length).toBe(4);
        });

        
        //set up message to send to client
        const roomId = seedData.data.groups[0]._id;
        const userID = seedData.data.groups[0].activeMembers[1]._id;
        const message = {id: userID, text:'new_message', time: "2020-01-22T22:04:37.511Z"};
        

        await wait(()=>{
            //send new message to client
            mockServer.emit('message', roomId, JSON.stringify(message));
            expect(queryAllByTestId('message').length).toBe(5);
        });
    });

    it('should update status of user to be online and then offline', async() =>{

        //colors for the online and offline states
        const onlineColor = 'rgb(0, 230, 118)';
        const offlineColor = 'rgb(158, 158, 158)';

        axiosMock.get.mockResolvedValueOnce(seedData);
    
        const {queryAllByTestId} = render(component);

        await wait(()=>{
            //check status badge color, 1&2 are online, 3 is offline
            const statusBadges = queryAllByTestId('status-badge-color');
            expect(statusBadges.length).toBe(3);
            expect(statusBadges[0].style.background).toBe(onlineColor);
            expect(statusBadges[1].style.background).toBe(onlineColor);
            expect(statusBadges[2].style.background).toBe(offlineColor);
        });

        //first group id and third member id from seed data 
        const groupId = seedData.data.groups[0]._id
        const memberId = seedData.data.groups[0].activeMembers[2]._id;

        await wait(()=>{
            //server emits message
            mockServer.emit('update_status', groupId, memberId, 'true');

            //status should update to all be online
            const statusBadges = queryAllByTestId('status-badge-color');
            expect(statusBadges[0].style.background).toBe(onlineColor);
            expect(statusBadges[1].style.background).toBe(onlineColor);
            expect(statusBadges[2].style.background).toBe(onlineColor);
        });


        await wait(()=>{
            //set status of third user to be offline
            mockServer.emit('update_status', groupId, memberId, 'false');

            //should return to offline color
            const statusBadges = queryAllByTestId('status-badge-color');
            expect(statusBadges[0].style.background).toBe(onlineColor);
            expect(statusBadges[1].style.background).toBe(onlineColor);
            expect(statusBadges[2].style.background).toBe(offlineColor);
        });        
    });

    it('should receive new group invite', async()=>{
        axiosMock.get.mockResolvedValueOnce(seedData);
    
        const {queryAllByTestId} = render(component);
        
        await wait(()=>{
            expect(queryAllByTestId('group-invite-item').length).toBe(3);
        });

        //mock get request for new invite data
        axiosMock.get.mockResolvedValueOnce(mockData.newInviteData);

        await wait(()=>{
            //server sends message to client to update pending list
            //client will send get request for new group invites
            mockServer.emit('update_pendinglist');
            expect(queryAllByTestId('group-invite-item').length).toBe(4);
        })
    });

    it('should update member list', async()=>{
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {queryAllByTestId} = render(component);

        await wait(()=>{
            expect(queryAllByTestId('group-member').length).toBe(3);
        });

        axiosMock.get.mockResolvedValueOnce(mockData.newMemberList);
        const groupId = seedData.data.groups[0]._id;

        await wait(()=>{
                //should update member list to now have four members
            mockServer.emit('update_memberlist', groupId);
            expect(queryAllByTestId('group-member').length).toBe(4);
        });
    });

    it('should update group description', async()=>{
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {queryByTestId} = render(component);

        const initDescription = seedData.data.groups[0].description;
        const newDescription = 'This is a new description';

        await wait(()=>{
            expect(queryByTestId('group-description').textContent).toBe(initDescription);
        });

        const groupId = seedData.data.groups[0]._id;

        await wait(()=>{
            //server emit message to client to update group description
            mockServer.emit('update_group', groupId, newDescription);
            expect(queryByTestId('group-description').textContent).toBe(newDescription);
        });
    });

    it('should remove group', async()=>{
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {queryAllByTestId} = render(component);
        const groupId = seedData.data.groups[0]._id;
        const groupName = seedData.data.groups[0].groupName;

        await wait(()=>{
            const groupTabs = queryAllByTestId('group-tab-button');
            expect(queryAllByTestId('group-tab-button').length).toBe(2);
            expect(groupTabs[0].textContent).toBe(groupName);
        });

        await wait(()=>{
            //server emit message to client to update group description
            mockServer.emit('remove_group', groupId);
            const groupTabs = queryAllByTestId('group-tab-button');
            expect(groupTabs.length).toBe(1);
            expect(groupTabs[0].textContent).not.toBe(groupName);
        });
    });

    it('should emit the proper messages via socket to server upon connection', async()=>{
        const currGroups = seedData.data.groups;
        const currUserId = seedData.data.user._id;
        let groupIndex = 0;

        //resuls track how many times correct messages to
        // 'join_room', 'update_status', and 'user' were received by the server
        let results = [0,0,0];

        mockServer.on('join_room', (groupId)=>{
            if(groupId === currGroups[groupIndex]._id) results[0]++;
        });

        mockServer.on('update_status', (groupId, userId, status)=>{
            if(groupId === currGroups[groupIndex]._id
               && userId === currUserId
               && status === 'true'){
                results[1]++;
                groupIndex++;
            }
        });

        mockServer.on('user', (userId)=>{
            if(userId === currUserId) results[2]++;
        });

        axiosMock.get.mockResolvedValueOnce(seedData);
        render(component);

        await wait(()=>{
            expect(results).toStrictEqual([2,2,1]);
        });
    });

    it('should log out properly', async()=>{
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {getByTestId} = render(component);
        const currUserId = seedData.data.user._id;

        //results variable tracks that server received the proper socket message
        //from the client
        let result = 0;
        mockServer.on('close_client', (userId) =>{
            if(userId === currUserId) result++;
        });

        await wait(()=>{
            expect(getByTestId('nav-logout')).toBeTruthy();
        });

        axiosMock.get.mockResolvedValueOnce({data:{loggedIn:false}});
        fireEvent.click(getByTestId('nav-logout'));

        await wait(()=>{
            expect(result).toBe(1);
        });
    });
});

describe('<ChatPage/> when the screen size is small', ()=>{
    afterEach(cleanup);
    const theme = createMuiTheme({props:{MuiWithWidth: {initialWidth:'sm'}}});
    const component = genComponent(theme);

    it('should render properly and open right drawer', async () =>{
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {queryByTestId} = render(component);

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
        const {queryByTestId} = render(component);

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
    const component = genComponent(theme);

    it('should render properly and open left drawer', async () =>{
        axiosMock.get.mockResolvedValueOnce(seedData);
        const {queryByTestId} = render(component);

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



