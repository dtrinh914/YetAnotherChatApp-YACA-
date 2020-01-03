function reducer(state, action){
    switch(action.type){
        case "INIT":
            return {groups: action.payload, selected: action.payload[0]._id};
        case "NEW_MSG":
            const newGroup = state.groups.map( group => {
                if(group._id === action.room ){
                    const newMessages = [...group.messages, action.message];
                    return {...group, messages:newMessages}
                } else {
                    return group;
                }
            });
            return {...state, groups:newGroup}
        case "CHANGE_ROOM":
            return {...state, selected: action.selected}
        default:
            return state;
    }
}

export default reducer;