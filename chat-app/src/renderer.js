/* Electron Remote */
const remote = require("electron").remote;
const app = remote.app;
const mainApp = remote.require("./main.js");
const MenuElc = remote.Menu;
const MenuItemElc = remote.MenuItem;

const path = require("path");
const url = require("url");

import React from "react";
import ReactDOM from "react-dom";

const request = require("request");

const root = document.getElementById("root");
//root.classList.add("pt-dark"); Main App Renderer
document.addEventListener("DOMContentLoaded", e => {
  ReactDOM.render(<App />, root);
});

//Websocket Client
const WebSocket = require('ws');

import ChatStore from "./chatStore";
//Convert Size into Supported DOM Sizes

//Main Session and Cookies
let mainSession = remote.getCurrentWebContents().session;
let cookies = mainSession.cookies;

//Axios
let axios = require("axios");

import LoginBox from "./components/LoginBox";
import RegisterBox from "./components/RegisterBox";
import ChatContainer from "./components/ChatContainer";
import ChatInputBar from "./components/ChatInputBar";
import UpdateUserDetails from "./components/UpdateUserDetails";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      senderName: "",
      url: "",
      users: [],
      messages: [],
      status: "",
      typing: {
        state: false,
        username: ""
      },
      showRegisterBox: false,
      showLoginBox: true,
      loginSuccess: false,
      showUpdateUserDetails: false
    };

    this.triggerConnected = this.triggerConnected.bind(this);

  }

  initSocket() {
    //Connect to the Server using websocket
    this.ws = new WebSocket('ws://localhost:3000')
    //console.log("IO: ", this.ws);

  }

  //Emit Connection Event to the Websocket server
  triggerConnected() {
    console.log("triggerConnected")
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.log("not ready yet")
    }else{
      console.log("App Not Initialized Please Call this After initSocket!");
      console.log("Emiiting Connected Users ", this.state.username);
      this.ws.send(JSON.stringify({"event": "connectedUser", "content": this.state.username})); ///< Override the Base Connect Event
      this.setState({ status: "connected" });
    }
     
  }

  triggerDisconnected() {
    this.ws.send(JSON.stringify({"event": "disconnectedUser", "content": ChatStore.getUsername()})); ///< Override the Base Connect Event

    //Remove Instance
    this.ws.close();
    //Show Login Page
    this.setState({ showLoginBox: true, loginSuccess: false });
    //Remove Cookies
    this.removeAuthCookies();
  }

  removeAuthCookies() {
    cookies.remove("http://localhost", "JWToken", () => {});
    cookies.remove("http://localhost", "username", () => {});
  }

  toggleUpdateUserDetails(show = true) {
    this.setState({ showUpdateUserDetails: show });
  }

  componentWillMount() {
    //Check For Authentication Cookies (JWT and Username), if exists! on App Startup
    //JWT Cookie
    cookies.get(
      {
        name: "JWToken"
      },
      (err, ck) => {
        if (ck.length > 0 && ck) {
          //Set Default Header for Next Requests
          console.log("AXIOS ", axios);
          axios.defaults.headers.common["Authentication"] =
            "JWT " + ck[0].value;

          //Get Username Cookie
          cookies.get(
            {
              name: "username"
            },
            (err, ck1) => {
              if (err)
                console.log("Username Could Not Be Fetched from the Cookie");
              else if (ck1.length > 0 && ck1) {
                let fetchedUsername = ck1[0].value;
                //let fetchedURL = ck1[0].value.split(" ")[0];
                console.log("Fetched Username from Cookies: ", fetchedUsername);
                // Initialize the ChatStore and retreive data from cookie //TODO: Change from
                // cookie into local JSON CONFIG FILE
                ChatStore.init(fetchedUsername);
                //Everything is OK Hide the Login Box, Next Time :) Baypass Login Request
                this.setState({
                  loginSuccess: true,
                  showLoginBox: false,
                  showRegisterBox: false
                });
              }
            }
          );
        }
      }
    );

    //Event Listeners Chat Session Initialized!
    ChatStore.on("initialized", username => {
      this.setState({
        username: username
      });
      console.log("USERNAME : ", username);
      this.initSocket(); ///< Initialize Sockets
      //Update Username and Login box open state
      this.setState({
        username: username,
        loginSuccess: true,
        showLoginBox: false
      });
      console.log("Initialized! ");

      //Disconnect Event
      app.on("will-quit", () => {
        this.ws.send(JSON.stringify({"event": "disconnectedUser", "content": this.state.username})); ///< Override the Base Connect Event

      });

      const thiz = this;
      this.ws.on('open', function open() {
        console.log("########open############");

        //init user
        thiz.triggerConnected();

      });

      this.ws.on('message', msg => {
        console.log("received message: ", msg );
        
        //switch for events
        const parsed = JSON.parse(msg);
        const {event, content} = parsed;

        switch(event){
            case 'chat-message': 
            console.log("Received New Message ", content);
            if (
              content.username &&
              content.message &&
              content.username != this.state.username
            ) {
              this.setState(prevState => ({
                messages: [
                  ...prevState.messages,
                  {
                    message: content.message,
                    username: content.username,
                    created: content.created
                  }
                ]
              }));
            }
              break;
            case "is-typing":
              this.setState({
                typing: {
                  state: true,
                  username: content
                }
              });              
              break;
            case "stopped-typing":
              this.setState({
                typing: {
                  state: false,
                  username: content
                }
              });              
              break;
            default:
        }

      });

        /* TYPING FEATURE! */
      //On Typing From The Store
      ChatStore.on("is-typing", () => {
        //Trigger Server Typing Event
        thiz.ws.send(JSON.stringify({event: "is-typing", content: this.state.username})); ///< Override the Base Connect Event

      });
      ChatStore.on("stopped-typing", () => {
        thiz.ws.send(JSON.stringify({event: "stopped-typing", content: this.state.username})); ///< Override the Base Connect Event

      });

      //On Start Typing From the Sockets
      this.ws.on("is-typing", user => {
        //Set Typing Object (Started)
        this.setState({
          typing: {
            state: true,
            username: user
          }
        });
      });
      //On Stopped Typing
      this.ws.on("stopped-typing", user => {
        //Set Typing Object (Stopped)
        this.setState({
          typing: {
            state: false,
            username: user
          }
        });
      });
    });

    //Update Messages
    ChatStore.on("new-message", msg => {
      console.log("New MESSAGE", msg, this.state.username);
      //Send MESSAGE Over Websockets

      const now = new Date();
      const created = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;


      this.ws.send(JSON.stringify({event: "chat-message", content: {
        message: msg,
        created: created,
        username: this.state.username
      }})); ///< Override the Base Connect Event


      //Update Messages
      this.setState(prevState => ({
        messages: [
          ...prevState.messages,
          {
            message: msg,
            created: created,
            username: this.state.username
          }
        ]
      }));
    });
  }

  handleRegisterClick() {
    this.setState({ showLoginBox: false, showRegisterBox: true });
  }

  handleLoginClick() {
    this.setState({ showRegisterBox: false, showLoginBox: true });
  }

  //Change Username
  changeUsername(username) {
    this.setState({ username: username });
  }

  render() {
    console.log("SHOW UPDAYE USER DETAILS: ", this.state.showUpdateUserDetails);
    return (
      <div className="flex-parent">
        <LoginBox
          cookies={cookies}
          ChatStore={ChatStore}
          isOpen={this.state.showLoginBox}
          handleRegisterClick={this.handleRegisterClick.bind(this)}
        />{" "}
        {this.state.showRegisterBox ? (
          <RegisterBox handleLoginClick={this.handleLoginClick.bind(this)} />
        ) : null}{" "}
        {this.state.showUpdateUserDetails && (
          <UpdateUserDetails ChatStore={ChatStore}
            showUpdateUserDetails={this.state.showUpdateUserDetails}
            toggleUpdateUserDetails={this.toggleUpdateUserDetails.bind(this)}
          />
        )}
        {this.state.loginSuccess && (
          <ChatContainer
            current={this.state.username}
            messages={this.state.messages}
            typing={this.state.typing}
            request={this.state.request}
            changeUsername={this.changeUsername.bind(this)}
            username={this.state.username}
            triggerDisconnected={this.triggerDisconnected.bind(this)}
            showUpdteUserDetails={this.state.showUpdateUserDetails}
            toggleUpdateUserDetails={this.toggleUpdateUserDetails.bind(this)}
          />
        )}{" "}
        {this.state.loginSuccess && <ChatInputBar ChatStore={ChatStore} />}{" "}
      </div>
    );
  }
}


/*
//Simple Menu
const menu = new MenuElc();
menu.append(
  new MenuItemElc({
    label: "Label1",
    click() {
      console.log("You Clicked Label 1");
    },
    hover() {
      console.log("You are Hovered over the Label1");
    }
  })
);
window.addEventListener(
  "contextmenu",
  e => {
    e.preventDefault();
    menu.popup(remote.getCurrentWindow());
  },
  false
);

*/
