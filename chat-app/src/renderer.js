/*const io = require('socket.io-client');

let socket = io('http://localhost:3000');

socket.emit("chat-message", "Hello There");*/

import React, {Component} from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import {
    Intent,
    Popover,
    Position,
    PopoverInteractionKind
} from "@blueprintjs/core";

const io = require('socket.io-client');

let ChatStore = require("./chatStore");

let root = document.getElementById("root");

document.addEventListener("DOMContentLoaded", e => {
    ReactDOM.render(<App />, root);

});

//main proc remote
let remote = require("electron").remote;


//session and cookies
let defaultSession = remote.session.defaultSession;
let cookies = defaultSession.cookies;


class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            url : "http://localhost:3000",
            messages: [],
            username: "NO USER",
            showLoginBox: true,
            showRegisterBox: false
        };

        this.hideLoginBox = this.hideLoginBox.bind(this);
        this.showRegisterBox = this.showRegisterBox.bind(this);
        this.showLoginBox = this.showLoginBox.bind(this);
    }

    componentWillMount(){

        //check for login cookies
        let username = null, token = null;
        cookies.get({name: 'JWToken'}, (err, ck) => {
            if(err)
                console.log('Token Cookie error, ', err);
            if(ck[0]){
                console.log('TOKEN: ', ck[0].value);
                token = ck[0].value;
                cookies.get({name: 'Username'}, (err, ck1) => {
                    if(err)
                        console.log('Username Cookie error, ', err);
                    if(ck1[0]){
                        console.log('TOKEN: ', ck1[0].value);
                        username = ck1[0].value;

                        //set default axios auth headers
                        if(username && token){
                            axios.defaults.headers.common['authentication'] = "JWT " + token;
                            ChatStore.init(username);
                            this.hideLoginBox();
                        }
                    }
                    
                });
            }
            
        });

        ChatStore.on("initialized", (username) => {
            this.initSocket(username);
            this.setState({username: username});

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
            });

        });

       
        
    }

    hideLoginBox(){
        this.setState({showLoginBox: false})
    }

    initSocket(username) {
        this.io = io(this.state.url);
        this.io.emit("connectedUser", username);

    }

    showRegisterBox(){
        console.log("triggering showRegisterBox");
        this.setState({showLoginBox: false, showRegisterBox: true});
    }

    showLoginBox(){
        console.log("triggering showLoginBox");
        this.setState({showLoginBox: true, showRegisterBox: false});
    }

    render(){

        return (
            <div className="flex-parent">
                {this.state.showLoginBox && (<LoginBox hideLoginBox={this.hideLoginBox} showRegisterBox={this.showRegisterBox}/>)}
                {this.state.showRegisterBox && (<RegisterBox showLoginBox={this.showLoginBox}/>)}
                
                <div className="flex-container-horz flex-grow">
                    <SideArea />
                    <ChatContainer messages={this.state.messages} username={this.state.username} />

                </div>
                <ChatInputBar  />
            </div>
        );

    }
}

class SideArea extends Component {
    constructor(props){
        super(props);
        this.state = { users: []};
    }

    getConnectedUsers () {
        axios.get("http://localhost:3000/user/connected")
        .then(res => {
            if(res.data.connectedUsers.length > 0){
                this.setState({users: res.data.connectedUsers});
                console.log(res.data.connectedUsers);
            }
        }).catch(err => {
            if(err){
                console.log("Connected Users Error: ", err);
            }
        })
    }

    componentWillMount(){
        setTimeout(() => {
            setInterval(() => {
                this.getConnectedUsers();
            }, 2000);
        }, 2000);
    }

    render(){
        return (
            <div id="side-area" className="col-md-3 flex-grow-2">
                <ConnectedUsers connected={this.state.users} />
                <Popover position={Position.RIGHT} isOpen={this.state.isSettingsOpen} content={
                    <div className="settings-container">
                    <div className="bordered-header">Settings</div>
                    <div className="options-container">
                      <div className="option">
                        <a
                          href="#"
                          onClick={() => this.props.toggleUpdateUserDetails()}
                        >
                          Update Details
                        </a>
                      </div>
                      <div className="option">
                        <p>Sign Out of the Chat</p>
                        <button
                          type="button"
                          className="pt-button pt-intent-danger"
                          onClick={() => {}}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
    </div>
                }>

                <span className="fa fa-cog fa-2x" onClick={() => { this.setState((prevState) => { isSettingsOpen: !prevState.isSettingsOpen }) }}></span>
                    
                </Popover>
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

class RegisterBox extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            username : '',
            password : '',
            fullName: '',
            email: ''

        }

        this.submitHandler = this.submitHandler.bind(this);
    }

    submitHandler(e){
        e.preventDefault();

        if(this.fullNameInput.value === ''){
            alert('Please enter your full name');
            return false;
        }else if (this.userNameInput.value === ''){
            alert('Please enter your username');
            return false;
        }else if (this.emailInput.value === ''){
            alert('Please enter your email');
            return false;
        }else if (this.passInput.value === ''){
            alert('Please enter your password');
            return false;
        }

        axios.post("http://localhost:3000/user/register", {
            fullName: this.fullNameInput.value,
            username: this.userNameInput.value,
            email: this.emailInput.value,
            password: this.passInput.value
        }).then(res =>{

            if(res.status == 200 && res.data.status == "success"){
                alert('You have successfully registered to the server');
                //show login box
                this.props.showLoginBox();
            }else if (res.data.status = "error"){
                alert(res.data.message);
                console.log(res.data.message);
            }


        }).catch(err => {
            console.log(err);
        })
    }

    render(){

        return (

        <div className="login-box">
                <div className="login-box-container">
                  <h3>Register on the Chat Application</h3>
                  <input name="fullname" type="text" className="form-control"
                  ref={input => (this.fullNameInput = input)} placeholder="Enter Full Name" key={0}/>
                  <input name="username" type="text" className="form-control"
                  ref={input => (this.userNameInput = input)} placeholder="Enter your Username" key={1}/>
                  <input name="email" type="text" className="form-control"
                  ref={input => (this.emailInput = input)} placeholder="Enter your Email" key={2}/>
                  <input name="password" type="password" className="form-control"
                  ref={passInput  => (this.passInput  = passInput )} placeholder="Password" key={3} />
                  <button type="button" className="btn btn-success btn-block" onClick={this.submitHandler}>
                   Register
                  </button>
                  <a href="#" onClick={() => {this.props.showLoginBox()}} >Back to Login!</a>
                </div>
        </div>
        )

    }
}

class LoginBox extends Component {
    constructor(props){
        super(props);
        /*this.state = {
            email: "",
            password: "",
        }*/

        console.log("Props from LoginBox ", props)

        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    }

    setCookies(username, token){
        //set jwt cookie
        cookies.set({
            url: 'http://localhost',
            domain: 'localhost',
            name: 'JWToken',
            value: token,
            expiratonDate: ( Date.now() / 1000 ) + ( 7 * 24 * 3600) 
        }, err => {
            if(err)
                console.log(err);
        } );

        //set username cookie
        cookies.set({
            url: 'http://localhost',
            domain: 'localhost',
            name: 'Username',
            value: username,
            expiratonDate: ( Date.now() / 1000 ) + ( 7 * 24 * 3600) 
        }, err => {
            if(err)
                console.log(err);
        } );

    }

    handleLoginSubmit(){

        console.log("handleLoginSubmit")

        const email = this.emailInput.value;
        const password = this.passInput.value;

        if(email === ''){
            alert("Please enter your email!");
            return;
        } else if(password === ''){
            alert("Please enter your password!")
        }

        axios.post("http://localhost:3000/user/login", {
            email,
            password
        }).then (res => {
            if(res.status == 200 && res.data.status == "success"){

                //this.setState({ email, password}); //needed?

                console.log(
                    "Username: ",
                    email,
                    " Token: ",
                    res.data.token
                );

                //save user login
                this.setCookies(email, res.data.token);

                ChatStore.init(email);

                 //Hide login box
                this.props.hideLoginBox();
               

            }else if (res.data.status == "error"){
                alert(res.data.message);
            }
        }).catch(err => {
            console.log("Axios error: ", err);
            alert("Error connecting to the server");
        })

    }

    render(){
        return (
            <div className="login-box">
                <div className="login-box-container">
                  <h3>Login to the Chat Application</h3>
                  <input name="email" type="text" className="form-control" 
                  ref={input => (this.emailInput = input)} placeholder="Email" key={0}/>
                  <input name="password" type="password" className="form-control"
                  ref={passInput  => (this.passInput  = passInput )} placeholder="Password" key={1} />
                  <button type="button" className="btn btn-success btn-block" onClick={this.handleLoginSubmit}>
                   Login
                  </button>
                  <a href="#" onClick={() => {this.props.showRegisterBox()}} >You don't have an Account, Please register!</a>
                </div>
            </div>
        );
    }
}

//Connected Users Component
function ConnectedUsers(props) {
    console.log("PROPS: ", props);
    return (
      <div className="users-container">
        <div className="bordered-header">Online</div>
        <div
          className="flex-container-vert"
          style={{ alignItems: "center", marginTop: "11px" }}
        >
          {!props.connected.length && <h5>No One is Online!</h5>}
          {props.connected.map((usr, idx) => {
            return <h5>{usr.username}</h5>;
          })}
        </div>
      </div>
    );
  }
