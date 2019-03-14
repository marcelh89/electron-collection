const express = require('express');
let jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);
let mongoose = require('mongoose');

let BodyParser = require('body-parser');

app.use(BodyParser.urlencoded({extended: true}))
app.use(BodyParser.json());

//connect and create 
mongoose.connect('mongodb://localhost:27017/chat_users', {useNewUrlParser: true });

//jwt middleware
app.use((req, res, next) => {
    if (
        req.headers &&
        req.headers.authentication &&
        req.headers.authentication.split(" ")[0] == "JWT"
    ) {
        jwt.verify(
            req.headers.authentication.split(" ")[1],
            "CHATAPPTKAPI123",
            (err, decode) => {
                if (err) {
                    return (req.user = null);
                }
                req.user = decode;
                next();
            }
        );
    } else {
        req.user = null;
        next();
    }
});

let userModel = require("../api/models/userModel")

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

