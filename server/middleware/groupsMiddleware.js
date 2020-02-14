const {isGroupMember, isAdmin, isCreator} = require('../util/mongoUtil');

// check if a user is a group member
const verifyGroupMember = (req,res,next) => {
    isGroupMember(req.user._id, req.params.id).then( response => {
        if(response.status === 1){
            next();
        } else {
            res.json({data:'Access denied.' , status:-1})
        }
    })
    .catch(()=>res.json({data:"There's an error processing your request." , status:-1}));
}

// check if a user is a group admin
const verifyAdmin = (req, res, next) => {
    isAdmin(req.user._id, req.params.id).then( response => {
        if(response.status === 1){
            next();
        } else {
            res.json({data:'Access denied.' , status:-1})
        }
    })
    .catch(()=>res.json({data:"There's an error processing your request." , status:-1}));
}

//check if a user is a creator
const verifyCreator = (req, res, next) => {
    isCreator(req.user._id, req.params.id).then( response => {
        if(response.status === 1){
            next();
        } else {
            res.json({data:'Access denied.' , status:-1})
        } 
    })
    .catch(()=>res.json({data:"There's an error processing your request." , status:-1}));
}

module.exports = {verifyGroupMember, verifyAdmin, verifyCreator};