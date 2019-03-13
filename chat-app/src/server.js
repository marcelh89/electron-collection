const express = require('express');
const app = express();
const port = 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let BodyParser = require('body-parser');

app.use(BodyParser.urlencoded({extended: true}))
app.use(BodyParser.json());

let userRoutes = require('../api/routes/userRoutes');
userRoutes.route(app);

io.on('connection', (socket) => {
    console.log('New client is connected!');

    socket.on("chat-message", (msg) => {
        console.log("New Message: ", msg);
        socket.broadcast.emit("chat-message", msg);
    });

});

http.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
});

