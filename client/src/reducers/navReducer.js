function reducer(state, action){
    switch(action.type){
        case 'ADDMEM':
            const prevRightNav = state.rightNav
            return {...state, rightNav:{...prevRightNav, addMem:true, root:true}};
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