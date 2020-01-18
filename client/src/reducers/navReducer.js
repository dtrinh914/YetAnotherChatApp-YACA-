function reducer(state, action){
    switch(action.type){
        //Shows add member selection
        case 'ADDMEM':
            const prevRightNav = state.rightNav;
            return {...state, rightNav:{...prevRightNav, addMem:true, root:true}};
        // opens left nav
        case 'OPENLEFT':
            return {...state, leftNav:{...state.leftNav, root: true}};
        // closes left nav
        case 'CLOSELEFT':
            return {...state, leftNav:{...state.leftNav, root: false}};
        // closes right nav
        case 'CLOSERIGHT':
            let newRightNav={};
            for(let key in state.rightNav){
                newRightNav[key] = false;
            }
            return {...state, rightNav:newRightNav};
        default:
            return state;
    }
}

export default reducer;