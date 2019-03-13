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
        this.state = {
            url : "http://localhost:3000",
            showLoginBox: true,
            messages: [],
            username: "NO USER"
        };

        this.hideLoginBox = this.hideLoginBox.bind(this);
    }

    componentWillMount(){
        console.log("componentWillMount");
        this.initSocket();

        ChatStore.on("initialized", (username) => {
            this.setState({username: username});
        });

        ChatStore.on("new-message", (msg) => {
            //Store the message
            let newMsg = {msg: msg, username: this.state.username };
            this.setState((prevState) => ({messages: [...prevState.messages, newMsg]}));
            this.io.emit("chat-message", newMsg);
            console.log("New Message " + JSON.stringify(newMsg));
        });


        //Message coming from other users
        this.io.on("chat-message", (newMsg) => {
            this.setState(prevState => ({
                messages: [...prevState.messages, newMsg]
            }))
            console.log("Message from another user ",newMsg);
        })
        
    }

    hideLoginBox(){
        this.setState({showLoginBox: false})
    }

    initSocket() {
        console.log("initSocket");
        this.io = io(this.state.url);
        console.log(this.io);

    }

    render(){

        return (
            <div className="flex-parent">
                {this.state.showLoginBox && <LoginBox hideLoginBox={this.hideLoginBox}/>}
                <div className="flex-container-horz flex-grow">
                    <div id="side-area" className="col-md-4 flex-grow-2">
                        Side
                    </div>
                    <ChatContainer messages={this.state.messages} username={this.state.username} />

                </div>
                <ChatInputBar  />
            </div>
        );

    }
}

class ChatContainer extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return  (
            <div id="main-area" className="col-md-9 flex-grow-3">
                
                <ul className="messages-container-owner">
                    {this.props.messages.map((msgObj, index) => {
                        {if(msgObj.username == this.props.username){
                            return <li key={index} class="message">{"You - " +msgObj.msg}</li>
                        }}
                        
                    })}
                </ul>

                <ul className="messages-container-sender">
                    {this.props.messages.map((msgObj, index) => {
                        {if(msgObj.username != this.props.username){
                            return <li key={index} class="message">{msgObj.username + " - " +msgObj.msg}</li>
                        }}
                        
                    })}
                </ul>

            </div>
        )

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
        //Empty the input field
        this.msgInput.value = '';
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

class LoginBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: ''
        }

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        //this.handleUsernameChange = this.handleUsernameChange.bind(this);
    }

    handleUsernameChange(){

    }

    handleLoginSubmit(){
        if(this.userNameInput.value === ''){
            alert("Please enter your username!");
            return;
        } else if(this.userPass.value = ''){
            alert("Please enter your password!")
        }

        this.setState({username: this.userNameInput.value, password: this.userPass.value});

        //TODO check if user credentials are okay

        //Hide login box
        this.props.hideLoginBox();

        ChatStore.init(this.userNameInput.value);

    }

    render(){
        return (
            <div className="login-box">
                <div className="login-box-container">
                  <h3>Enter your Username</h3>
                  <input name="username" type="text" className="form-control" onChange={this.handleUsernameChange}
                  ref={input => (this.userNameInput = input)} placeholder="Username or Email" key={0}/>
                  <input name="password" type="password" className="form-control" onChange={this.handleUsernameChange}
                  ref={input => (this.userPass = input)} placeholder="Password" key={0} />
                  {/*<input name="password" type="password" className="form-control" onChange={this.handleUsernameChange}
                   ref={usernameInput => (this.userNameInput = usernameInput)} />*/}
                  <button type="button" className="btn btn-success btn-block" onClick={this.handleLoginSubmit}>
                   Login
                  </button>
                </div>
            </div>
        );
    }
}
