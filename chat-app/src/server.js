const express = require('express');
const app = express();
const port = 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log('New client is connected!');

    socket.on("newMessage", (msg) => {
        console.log("New Message: ", msg);
    });

});

http.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
});

