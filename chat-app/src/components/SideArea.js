import React from "react";
import axios from "axios";
import {
    Popover,
    Position
} from "@blueprintjs/core";

import ConnectedUsers from "./ConnectedUsers";

export default class SideArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            connectedUsers: []
        };
    }

    getConnectedUsers() {
        //Get Currently Connected Users on the Server
        axios
            .get("http://localhost:3000/user/connected")
            .then(res => {
                console.log("Connected Users ", res);
                if (res.data.status == "success" && res.status == 200) {
                    //Success
                    console.log("Connected Users : ", res.data.connectedUsers);
                    this.setState(prevState => {
                        let connected = [];
                        for (let usr of res.data.connectedUsers) {
                            console.log("Right Connected User: ", usr);
                            if (usr.username != this.props.username) {
                                //Add only Other Connected Users (Not Yourself!)
                                connected.push(usr);
                            }
                        }
                        return { connectedUsers: connected };
                    });
                } else if (res.data.status == "error") {
                    //Server Error
                    alert("Cannot Get Connected Users, Server Error!");
                    console.log(
                        "Cannot Get Connected Users, Server Error, ",
                        res.data.message
                    );
                }
            })
            .catch(e => {
                if (e) {
                    alert("Cannot Get Connected Users, Error Connecting to the Server!");
                    console.log(
                        "Cannot Get Connected Users, Error Connecting to the Server, ",
                        e.message
                    );
                }
            });
    }

    componentWillMount() {
        //Set a timeout for fetching Connected Users each 2 secs
        setInterval(this.getConnectedUsers.bind(this), 7200);
        this.getConnectedUsers();
    }

    render() {
        return (
            <div id="side-area" className="col-md-3 flex-grow flex-parent">
                <ConnectedUsers username={this.props.username} connected={this.state.connectedUsers} />
                <div className="user-settings">
                    <Popover
                        position={Position.RIGHT}
                        isOpen={this.state.isSettingsOpen}
                        content={
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
                                            onClick={this.props.triggerDisconnected}
                                        >
                                            Logout
                    </button>
                                    </div>
                                </div>
                            </div>
                        }
                    >
                        <span
                            className="fa fa-cog fa-2x"
                            onClick={() => {
                                this.setState(prevState => ({
                                    isSettingsOpen: !prevState.isSettingsOpen
                                }));
                            }}
                        />
                    </Popover>
                </div>
            </div>
        );
    }
}