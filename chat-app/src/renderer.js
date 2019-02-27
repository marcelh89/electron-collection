/*const io = require('socket.io-client');

let socket = io('http://localhost:3000');

socket.emit("chat-message", "Hello There");*/

import React, {Component} from "react";
import ReactDOM from "react-dom";

const io = require('socket.io-client');

let ChatStore = require("./chatStore");

let root = document.getElementById("root");

document.addEventListener("DOMContentLoaded", e => {
    ReactDOM.render(<App />, root);

});

//const EventEmitter = require("events").EventEmitter;

class App extends Component {
    constructor(props){
        super(props);
        this.state = { url : "http://localhost:3000"}
    }

    componentWillMount(){
        console.log("componentWillMount");
        this.initSocket();

        ChatStore.on("new-message", (msg) => {
            this.io.emit("chat-message", msg);
            console.log("New Message " + msg);
        });

        this.io.on("chat-message", (msg) => {
            console.log("Message from another user ",msg);
        })
        
    }

    initSocket() {
        console.log("initSocket");
        this.io = io(this.state.url);
        console.log(this.io);

    }

    render(){

        return (
            <div className="flex-parent">
                <div className="flex-container-horz flex-grow">
                    <div id="side-area" className="col-md-4 flex-grow-2">
                        Side
                    </div>
                    <div id="main-area" className="col-md-9 flex-grow-3">
                        MAIN
                    </div>
                </div>
                <ChatInputBar />
            </div>
        );

    }
}

class ChatContainer extends Component {
    constructor(props){
        super(props);
    }

    render(){

    }
}

class ChatInputBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            message : ""
        }

        console.log("ChatInputBar.constructor");

    }

    sendMessage(e){
        console.log("ChatInputBar.sendMessage");

        e.preventDefault();
        this.setState({ message: this.msgInput.value });
        ChatStore.addMessage(this.msgInput.value);
        //console.log("Message: " + this.msgInput.value);
    }

    render(){
        console.log("ChatInputBar.render");

        return (
            <div id="chat-bar-container">
                <form id="chat-form">
                    <input key={0} id="chat-input" type="text" placeholder="Type your Message..." ref={(input) => {this.msgInput = input}}/>
                    <button type="submit" id="chat-submit" className="btn btn-success" onClick={this.sendMessage.bind(this)}>Send Message</button>
                </form>
            </div>
        )
    }
}

