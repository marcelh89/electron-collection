const express = require("express");
const app = express();
const port = 3000;
const server = require("http").createServer(app);
const WebSocket = require("ws");
const wss = new WebSocket.Server({server});

//const io = require("socket.io")(http);
let mongoos = require("mongoose");

let jwt = require("jsonwebtoken");

let BodyParser = require("body-parser");

app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());

//Connect and Create Database
mongoos.connect("mongodb://localhost/chat_users");

//JWT Middleware
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

let UserModel = require("../api/models/userModel");

let userRoutes = require("../api/routes/userRoutes");

userRoutes.route(app);

let users = require("../api/users");

function broadcastMessage (ws, message) {
    wss.clients.forEach(function each(client) {
        //if (ws != client && client.readyState === WebSocket.OPEN) {  //everyone but the one who sent the message
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
    });
}

wss.on("connection", (ws) => {

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        //switch for events
        const parsed = JSON.parse(message);
        const {event, content} = parsed;


        switch(event){
            case 'connectedUser': 
                console.log("connectedUser");
                users.addNewUser(content);
                break;
            case 'disconnectedUser':
                console.log("disconnectedUser");
                break;
            case 'open': 
                console.log("open");
                break;
            case 'is-typing':
                console.log("is-typing");
                broadcastMessage(ws, parsed);
                break;
            case 'stopped-typing':
                console.log("stopped-typing");
                broadcastMessage(ws, parsed);
                break;
            case 'chat-message':
                console.log("chat-message", content );
                broadcastMessage(ws, parsed);
                break;
            default:
                console.log("unknown event");

        }

        // broadcastMessage(ws, parsed);

    });

});


//Server Listens On Port
server.listen(port, () => {
    console.log("Server Is Running Port: " + port);
});