const {isGroupMember, isAdmin, isCreator} = require('../util/mongoUtil');

// check if a user is a group member
const verifyGroupMember = (req,res,next) => {
    isGroupMember(req.user._id, req.params.id).then( response => {
        if(response.status === 1){
            next();
        } else if(response.status === 0){
            accessDenied();
        } else {
            errorHandler();
        }
    })
}

// check if a user is a group admin
const verifyAdmin = () => {
    isAdmin(req.user._id, req.params.id).then( response => {
        if(response.status === 1){
            next();
        } else if(response.status === 0){
            accessDenied();
        } else {
            errorHandler();
        }
    })
}

//check if a user is a creator
const verifyCreator = () => {
    isCreator(req.user._id, req.params.id).then( response => {
        if(response.status === 1){
            next();
        } else if(response.status === 0){
            accessDenied();
        } else {
            errorHandler();
        }
    })
}

const accessDenied = () => {
    console.log('You do not have permission');
}
const errorHandler = () => {
    console.log(err)
}


module.exports = {verifyGroupMember, verifyAdmin, verifyCreator};