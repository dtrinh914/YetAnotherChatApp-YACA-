const LocalStrategy = require('passport-local');
const {loginUser, findUserById} = require('./mongoUtil');

const passConfig = (passport) => {
    // configure passport.js to use the local strategy
    passport.use(new LocalStrategy(
        (username, password, done) => {
            loginUser(username, password)
            .then( response => {
                if(response.verified){
                    return done(null, response.user);
                } else if(response.verified === false) {
                    return done(null, false, {message: 'Incorrect Password'});
                } else {
                    return done(null, false, {message: "User Doesn't Exist"});
                }
            })
            .catch( err => done(err)); 
        }
    ));

    //tell passport how to serialize user
    passport.serializeUser((user,done) => {
        done(null, user._id);
    });
    passport.deserializeUser((id, done) => {
        findUserById(id)
        .then(user =>  {done(null, user)})
        .catch(error => done(error, false));
    });    
}

module.exports = passConfig;