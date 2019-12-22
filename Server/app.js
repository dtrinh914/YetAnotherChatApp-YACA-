const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const {addUser, loginUser} = require('./util/mongoUtil');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// route to login user
app.post('/users/login', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    loginUser(username, password).then( response => {
        if(response === 1){
            res.redirect('/chat');
        } else if(response === 0) {
            res.send('The username and/or password does not match.');
        } else {
            res.send('There is an error with processing your request');
        }
    })
});

// route to add new user to database
app.post('/users/new', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    addUser(username, password).then( response =>{
        if(response === 1){
            res.send('Created Account');
        } else if(response === 0) {
            res.send('Username already exists');
        } else {
            res.send('There is an error with processing your request');
        }
    });
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (message)=>{
        socket.broadcast.emit('chat message', message);
    });
});

http.listen(5000, ()=> {
    console.log('Server has started');
});