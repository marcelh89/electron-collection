import React from "react";
import axios from "axios"
import {
    Overlay
} from "@blueprintjs/core";

export default class UpdateUserDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = { username: "", password: "" };
    }

    update() {
        axios.post("http://localhost:3000/user/update", { username: this.state.username, password: this.state.password, oldUsername: this.props.ChatStore.getUsername() })
            .then((res) => {
                if (res.data.status == "success") {
                    alert("User Data has been Successfully Changed!");
                } else if (res.data.status == "error") {
                    alert("Cannot Change User Data! " + res.data.message);
                }
            }).catch((e) => {
                if (e) {
                    alert("Cannot Update Data!");
                    console.log(e);
                }
            })
    }

    render() {
        return (
            <Overlay
                isOpen={this.props.showUpdateUserDetails}
                canOutsideClickClose={true}
                onClose={() => this.props.toggleUpdateUserDetails(false)}
                className="update-user"
            >
                <div className="update-user-container">
                    <div className="bordered-header">Update Details</div>
                    <div>
                        <div className="pt-form-group">
                            <label htmlFor="username" className="pt-label">
                                New Username
              </label>
                            <div className="pt-form-content">
                                <div className="pt-input-group">
                                    <input
                                        type="text"
                                        className="pt-input"
                                        placeholder="New Username"
                                        className="pt-input"
                                        onChange={e => this.setState({ username: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pt-form-group">
                            <label htmlFor="password" className="pt-label">
                                New Password
              </label>
                            <div className="pt-form-content">
                                <div className="pt-input-group">
                                    <input
                                        type="password"
                                        className="pt-input"
                                        placeholder="New Password"
                                        className="pt-input"
                                        onChange={e => this.setState({ password: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            class="pt-button pt-intent-success"
                            onClick={this.update.bind(this)}
                        >
                            Update
            </button>
                    </div>
                </div>
            </Overlay>
        );
    }
}