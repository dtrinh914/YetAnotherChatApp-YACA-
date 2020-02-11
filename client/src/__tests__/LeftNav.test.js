import React from 'react';
import LeftNav from '../components/LeftNav';
import {ChatProvider} from '../contexts/chatContext';
import {NavProvider} from '../contexts/navContext';
import {render, cleanup} from '@testing-library/react';
import {createMuiTheme} from '@material-ui/core/styles';
import {MuiThemeProvider} from '@material-ui/core/styles';

const seedGroupData = [
                        {"_id":"5e2a008c295fb74748745ab1", "groupName":"test_group1"},
                        {"_id":"5e2a008c295fb74748745ab2", "groupName":"test_group2"},
                        {"_id":"5e2a008c295fb74748745ab3", "groupName":"test_group3"}
                      ];

const seedUserData = {
                        "_id":"5e28c5c685ffc434b337c269",
                        "username":"test_user",
                        "friends":[],
                        "groupInvites":[
                                        {"_id":"5e41bbfac6986fe54f1e8d22","groupName":"group_invite1","description":""},
                                        {"_id":"5e41bc76c6986fe54f1e8d23","groupName":"group_invite2","description":""},
                                        {"_id":"5e3eee8ae1c35bdd60ffb0bf","groupName":"group_invite3","description":""}
                                       ],
                        "friendInvites":[],
                        "blocked":[]
                     };

const mockFunction = () => {
    console.log('Triggered');
}

const component = <NavProvider>
                  <ChatProvider>
                     <LeftNav groupData={seedGroupData} userData={seedUserData} 
                        joinRoom={mockFunction} updateMembers={mockFunction} />
                  </ChatProvider>
                  </NavProvider>;

afterEach(cleanup);

test('should render leftnav properly as a sidebar', ()=>{
    const theme = createMuiTheme({props:{MuiWithWidth: {initialWidth:'sm'}}});
    const {queryByTestId, queryAllByTestId} = render(<MuiThemeProvider theme={theme}>
                                                        {component}
                                                     </MuiThemeProvider>);

    //check that left nav was rendered
    expect(queryByTestId('left-drawer')).toBeNull();
    expect(queryByTestId('left-nav')).toBeTruthy();

    //check that the UserCard component rendered with proper username
    expect(queryByTestId('usercard-username').textContent).toBe('test_user');

    //check that the Groups component rendered with a list of groups containing 3 elements
    expect(queryAllByTestId('group-tab-name').length).toBe(3);

    //check that the GroupInvites component rendered with a list containing 3 invites
    expect(queryByTestId('group-invites-list').children.length).toBe(3);
});

test('should not render leftnav', ()=>{
    const theme = createMuiTheme({props:{MuiWithWidth: {initialWidth:'xs'}}});
    const {queryByTestId} = render(<MuiThemeProvider theme={theme}>
                                        {component}
                                   </MuiThemeProvider>);
    expect(queryByTestId('left-nav')).toBeNull();
});
