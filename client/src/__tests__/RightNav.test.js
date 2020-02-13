import React from 'react';
import RightNav from '../components/RightNav';
import {ChatProvider} from '../contexts/chatContext';
import {NavProvider} from '../contexts/navContext';
import {render, cleanup} from '@testing-library/react';
import {createMuiTheme} from '@material-ui/core/styles';
import {MuiThemeProvider} from '@material-ui/core/styles';

afterEach(cleanup);

const seedData = {"_id":"5e2a008c295fb74748745ab9",
                  "groupName":"New group",
                  "description":"",
                  "messages":[
                                {id: "5e28c5c185ffc434b337c266", 
                                text:"This is message 1.", 
                                time:"2020-01-22T22:02:35.511Z"
                                },
                                {id: "5e28c5bc85ffc434b337c264", 
                                text:"This is message 2.", 
                                time:"2020-01-22T22:03:36.511Z"
                                },
                                {id: "5e28c5c485ffc434b337c268", 
                                text:"This is message 3.", 
                                time:"2020-01-22T22:04:37.511Z"
                                }
                             ],
                  "activeMembers":[
                                  {"_id":"5e28c5c185ffc434b337c266","username":"test_user1"},
                                  {"_id":"5e28c5bc85ffc434b337c264","username":"test_user2"},
                                  {"_id":"5e28c5c485ffc434b337c268","username":"test_user3"}
                                  ],
                   "pendingMembers":[],
                   "pendingRequests":[],
                   "blocked":[],
                   "creator":"5e28c5c185ffc434b337c266",
                   "admins":["5e28c5c185ffc434b337c266"],
                   "memberMap":{
                               "5e28c5c185ffc434b337c266":{"username":"test_user1"},
                               "5e28c5bc85ffc434b337c264":{"username":"test_user2"},
                               "5e28c5c485ffc434b337c268":{"username":"test_user3"}
                               }
                 }

const component = <ChatProvider>
                  <NavProvider>
                        <RightNav currentGroup={seedData} />
                  </NavProvider>
                  </ChatProvider>

describe('right nav when window size is md', ()=>{
    const theme = createMuiTheme({props:{MuiWithWidth: {initialWidth:'md'}}}); 
                        
    it('should render properly and match snapshot', ()=>{
        const {container, queryByTestId} = render(<MuiThemeProvider theme={theme}>
                                                        {component}
                                                  </MuiThemeProvider>);
        expect(queryByTestId('right-nav-drawer')).toBeNull();
        expect(container).toMatchSnapshot();
    });
})

describe('right nav when window size is sm', ()=>{
    const theme = createMuiTheme({props:{MuiWithWidth: {initialWidth:'sm'}}});
    it('should render empty div and match snapshot', ()=>{
        const {container} = render(<MuiThemeProvider theme={theme}>
                                        {component}
                                   </MuiThemeProvider>);
        expect(container).toMatchSnapshot();
    });
})
