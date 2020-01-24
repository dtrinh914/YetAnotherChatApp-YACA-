function reducer(state, action){
    let newGroupState, newPendingState, newUserState, newSelectedState;

    //create a hashtable using the memberID as a key and the member info as the value
    const createMemberMap = (members) => {
        let hashMap = {};
        members.map( member => hashMap[member._id] = {username: member.username});
        return hashMap;
    }

    switch(action.type){
        // gathers all chat data {type: 'INIT', payload: *}
        case "INIT":
            //loops through each group and creates a member hashtable in each
            newGroupState = action.payload.groups.map(group => {
                const memberMap = createMemberMap(group.activeMembers);
                group.memberMap = memberMap;
                return group;
            });
            action.payload.groups = newGroupState;
            return action.payload;
        // inputs new message in state {type:'NEW_MSG, room: *, message: *}
        case "NEW_MSG":
            newGroupState = state.groups.map( group => {
                if(group._id === action.room ){
                    const newMessages = [...group.messages, action.message];
                    return {...group, messages:newMessages};
                } else {
                    return group;
                }
            });
            return {...state, groups:newGroupState};
        // adds new a new group {type:'ADD_GROUP', payload: *}
        case "ADD_GROUP":
            //create hashmap of new group members
            action.payload.memberMap = createMemberMap(action.payload.activeMembers);
            newGroupState = [...state.groups, action.payload];
            newSelectedState = {...state.selected, _id: action.payload._id, 
                                name: action.payload.groupName, index: newGroupState.length-1};
            return {...state, groups:newGroupState, selected:newSelectedState};
        // changes the current view of the chat page {type:'CHANGE_GROUP, selected:*, name:*, index:*}
        case "CHANGE_GROUP":
            return {...state, selected: {_id: action.selected, name:action.name, type:'group', index:action.index}}
        // adds a new member to a group {type:'ADD_MEMBER', groupId:*, memberId:*}
        case "ADD_MEMBER":
            newGroupState = state.groups.map( group => {
                if(group._id === action.groupId){
                    let newPendingMembers = group.pendingMembers;
                    newPendingMembers.push(action.memberId);
                    return {...group, pendingMembers: newPendingMembers};
                } else {
                    return group;
                }
            });
            return {...state, groups:newGroupState};
        // updates member list {type:'UPDATE_MEMBERS',groupId:*, payload:*}
        case "UPDATE_MEMBERS":
            newGroupState = state.groups.map( group => {
                if(group._id === action.groupId){
                    return {...group, ...action.payload, memberMap: createMemberMap(action.payload.activeMembers)};
                } else {
                    return group;
                }
            });
            return {...state, groups:newGroupState};
        // updates pending invites state {type:'UPDATE_PENDING', payload:*}
        case "UPDATE_PENDING":
            newPendingState = action.payload;
            newUserState = {...state.user, groupInvites: newPendingState};
            return {...state, user:newUserState};
        // decline invite {type:'DECLINE_INVITE, id:*}
        case "DECLINE_INVITE":
            newPendingState = state.user.groupInvites.filter( group => group._id !== action.id);
            newUserState = {...state.user, groupInvites: newPendingState};
            return {...state, user:newUserState};
        default:
            return state;
    }
}

export default reducer;