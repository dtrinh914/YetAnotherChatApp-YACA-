function reducer(state, action){
    let prevRightNav, prevLeftNav;
    switch(action.type){
        //opens/close add member selection
        case 'ADDMEM':
            prevRightNav = state.rightNav;
            return {...state, rightNav:{...prevRightNav, addMem:action.open}};
        //open/close group settings menu
        case 'GROUPSETTINGS':
            prevRightNav = state.rightNav;
            return {...state, rightNav:{...prevRightNav, groupSettings:action.open}};
        //open/close leave group window
        case 'LEAVEGROUP':
            prevRightNav = state.rightNav;
            return {...state, rightNav:{...prevRightNav, leaveGroup:action.open}};
        //opens/close right nav
        case 'RIGHT':
            prevRightNav = state.rightNav;
            return {...state, rightNav:{...prevRightNav, root:action.open}};
        case 'RIGHTDRAWER':
            prevRightNav = state.rightNav;
            return {...state, rightNav:{...prevRightNav, drawer:action.open}};
        //opens/close left nav
        case 'LEFTDRAWER':
            prevLeftNav = state.leftNav;
            return {...state, leftNav:{...prevLeftNav, drawer:action.open}};
        //Shows add member selection
        case 'NEWGROUP':
            prevLeftNav = state.leftNav;
            return {...state, leftNav:{...prevLeftNav, newGroup:action.open}};
        //changes chat page view
        case 'VIEW':
            return {...state, view: action.view}
        default:
            return state;
    }
}

export default reducer;