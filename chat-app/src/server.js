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
        if (ws != client && client.readyState === WebSocket.OPEN) {  //everyone but the one who sent the message
        //if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
    });
}

//Main Socket Connection
/*io.on("connection", socket => {
    socket.on("connectedUser", username => {
        users.addNewUser(username);
        console.log("New User ", username);
    });

    socket.on("chat-message", msg => {
        console.log("New Message " + msg.message);
        socket.broadcast.emit("chat-message", msg);
    });

    //Started Typing
    socket.on("is-typing", username => {
        //Send Target Username (Started)
        socket.broadcast.emit("is-typing", username);
    });
    //Stopped Typing
    socket.on("stopped-typing", username => {
        //Send Target UserName (Stopped)
        socket.broadcast.emit("stopped-typing", username);
    });
});
*/


wss.on("connection", (ws) => {

    /*ws.on('open', function open() {
        console.log('open');
        ws.send(Date.now());
    });
       
    ws.on('close', function close() {
        console.log('close');
    });*/

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        //console.log(ws.WebSocket);


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
                //broadcastMessage(ws, "is-typing", username);
                break;
            case 'stopped-typing':
                console.log("stopped-typing");
                //broadcastMessage(ws, "stopped-typing", username);
                break;
            case 'chat-message':
                console.log("chat-message", content );
                broadcastMessage(ws, parsed);
                break;
            default:
                console.log("unknown event");

        }

        //broadcastMessage(ws, event, content);

    });

    /*ws.on("connectedUser", username => {
        users.addNewUser(username);
        onsocle.log("New User ", username);
    });

    ws.on("chat-message", msg => {
        console.log("New Message " + msg.message);
        broadcastMessage(ws, "chat-message", msg);
    });

    //Started Typing
    ws.on("is-typing", username => {
        //Send Target Username (Started)
        broadcastMessage(ws, "is-typing", username);
    });
    //Stopped Typing
    ws.on("stopped-typing", username => {
        //Send Target UserName (Stopped)
        broadcastMessage(ws, "stopped-typing", username);
    });
    */
   
});


//Server Listens On Port
server.listen(port, () => {
    console.log("Server Is Running Port: " + port);
});