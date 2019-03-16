import React from "react";
import SideArea from "./SideArea";


export default class ChatContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    handleRequestSend() {
        this.props.request.get(
            {
                uri: "http://localhost:3000/tasks",
                json: true
            },
            (err, httpRes, body) => {
                if (err) console.error("Send Request Error ", err);
                console.log(body);
            }
        );
    }

    handleNewMessage(e) {
        console.log("NEW MESSAGE ADDED TO THE DOM");
    }

    componentWillUpdate() {
        console.log("Updating Chat Container");
    }

    render() {
        //Check if typing
        let typing;
        //if(this.props.typing.state)
        console.log("Typing: 5", this.props.typing);

        if (this.props.typing.state)
            typing = this.props.typing.username + " is typing...";
        else typing = "";

        return (
            <div className="flex-container-horz flex-grow">
                {" "}
                {/*Side Area*/}
                <SideArea
                    username={this.props.username}
                    changeUsername={this.props.changeUsername}
                    triggerDisconnected={this.props.triggerDisconnected}
                    toggleUpdateUserDetails={this.props.toggleUpdateUserDetails}
                />{" "}
                {/*Main Area*/}{" "}
                <div
                    id="main-area"
                    className="col-md-9 flex-grow-3"
                    onChange={this.handleNewMessage.bind(this)}
                >
                    <ul className="messages-container-owner">
                        {" "}
                        {this.props.messages.map((content, index) => {

                            const username = this.props.current == content.username ? 'Me' : content.username;

                            return (
                                <li className="message-container" key={index}>
                                    <a href="https://placeholder.com"><img src="https://via.placeholder.com/32" /></a>
                                    <div className="message-subcontainer">
                                        <div>{username + " - " + content.created}{" "}</div>
                                        <div>{content.message}{" "}</div>
                                    </div>

                                </li>
                            );

                        })}{" "}

                        {typing && <li>{typing}</li>}
                    </ul>{" "}

                </div>{" "}
            </div>
        );
    }
}