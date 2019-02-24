/*const io = require('socket.io-client');

let socket = io('http://localhost:3000');

socket.emit("newMessage", "Hello There");*/

import {Component} from "react";
import ReactDOM from "react-dom";

let root = document.getElementById("root");

document.addEventListener("DOMContentLoaded", e => {
    ReactDOM.render(<App />, root);

});

class App extends Component {
    constructor(props){
        super(props);
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
    }

    render(){
        return (
            <div id="chat-bar-container">
                <form id="chat-form">
                    <input id="chat-input" type="text" placeholder="Type your Message..."/>
                    <button type="submit" id="chat-submit" className="btn btn-success">Send Message</button>
                </form>
            </div>
        )
    }
}

