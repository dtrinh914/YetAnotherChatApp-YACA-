function reducer(state, action){
    switch(action.type){
        case "INIT":
            return action.payload;
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
        case "ADD_GROUP":
            const newGroupsData = [...state.groups, action.payload]
            return {...state, groups:newGroupsData};
        case "CHANGE_GROUP":
            return {...state, selected: {_id: action.selected, name:action.name, type:'group', index:action.index}}
        default:
            return state;
    }
}

export default reducer;