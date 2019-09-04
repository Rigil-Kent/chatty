const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io')
const Filter = require('bad-words');
const { generateMessage, generateWelcome, generateLocMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')


const app = express();
const server = http.createServer(app);
const io = socket(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');


app.use(express.static(publicDirectoryPath));


let welcome = "Welcome to Chatty";
let motd = "MOTD: Lorem ipsum...";
let restrictions = "relaxed";
let newUserAlert = "A new challenger has entered...";
let userLeftMsg = 'Numbnuts has left the building!';


io.on('connection', (socket) => {

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({id: socket.id, ...options}); 

        if (error) {
            return callback(error);
        }
        
        socket.join(user.room);

        // Emit sends events to the server/client
        socket.emit('messageUpdated', generateWelcome(welcome));
        socket.emit('messageUpdated', generateWelcome(motd));
        socket.broadcast.to(user.room).emit('messageUpdated', generateMessage('Admin', `${user.nickname} has joined`));
        io.to(user.room).emit('roomUpdated', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);


        const filter = new Filter();

        if (filter.isProfane(message)) {
            if (restrictions == "relaxed") {
                message = filter.clean(message);
            } else if (restrictions == "disabled"){
                message = message;
            } else {
                return callback('Profanity is not allowed');
            }
        }

        io.to(user.room).emit('message',generateMessage(user.nickname, message));
        callback("Message sent...");
    });


    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('locMessage', generateLocMessage(user.nickname, `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    });

    socket.on('disconnect', () => {

        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('messageUpdated', generateMessage(`${user.nickname} has left.`));
            io.to(user.room).emit('roomUpdated', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    
    })

});




server.listen(port, () => {
    console.log(`Chat server running on port ${port}!`);
});
