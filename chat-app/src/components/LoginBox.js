import React from "react";
import axios from "axios";
import {
    Alert
} from "@blueprintjs/core";

export default class LoginBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            url: "http://localhost:3000",
            token: "NO_TOKEN",
            isOpen: this.props.isOpen,
            showLoginError: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isOpen != this.state.isOpen) {
            this.setState({ isOpen: nextProps.isOpen });
        }
    }

    getUsername() {
        return this.state.email;
    }

    getPassword() {
        return this.state.password;
    }

    handleEmailChange(e) {
        this.setState({ email: e.target.value });
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    handleLoginSubmit(e) {
        console.log(this.state);

        if (!this.state.email) {
            alert("Please Enter a Valid Email!");
            return false;
        } else if (!this.state.password) {
            alert("Please Enter Your Password");
            return false;
        }

        //User Credentials
        let formData = {
            email: this.state.email,
            password: this.state.password
        };

        //Login Request
        axios
            .post("http://localhost:3000/user/login", formData)
            .then(res => {
                console.log("LOGIN ", res);
                if (res.data.status == "success" && res.status == 200) {
                    //Success
                    alert("Welcome Back!");
                } else if (res.data.status == "error") {
                    //Error
                    return alert("Error Login User, " + res.data.message);
                }
                //Set Token on App State
                this.setState({ token: res.data.token, showLoginError: false });

                //Set Default HTTP Headers (Next Request with JWT Token)
                axios.defaults.headers.common["Authentication"] =
                    "JWT " + res.data.token;

                //Setup AUTH Cookie
                this.setupAuthCookie();

                //Username and Password OK
                console.log("Setting Chatstore Username ", this.state.email);
                this.props.ChatStore.init(this.state.email);

                //Hide Login Box
                this.setState({ isOpen: false });
            })
            .catch(e => {
                if (e) {
                    alert("Error Connecting to the Server!");
                    console.log("Error Connecting to the Server ", e.message);
                }
            });

        //Empty the Fileds (Better User Experience)
        if (this.emailInput) this.emailInput.value = "";
        if (this.passInput) this.passInput.value = "";
    }

    //Hide Login Box
    hideBox() {
        //NOT USED!
        //Access DOM Element's Classes and Add Hidden Class to the Array
        this.login_box.classList.add("hidden");
    }

    //Set JWT Auth and Username Cookies For The Current Session
    setupAuthCookie() {
        //When there is no Token, Discard Cookies (No Successfull login!)
        if (!this.state.token) {
            console.error("Cannot Set Cookie, Auth Token Not Defined!");
            return false;
        }

        //Set JWT Token Cookie
        console.log("Setting JWT Cookie ", this.state.token);
        this.props.cookies.set(
            {
                url: "http://localhost",
                name: "JWToken",
                domain: "localhost",
                value: this.state.token
            },
            err => {
                if (err) console.log("Error Setting Auth Cookie ", err);
                else {
                    //Set Username Cookie
                    console.log("Setting Username COOKIE: ", this.state.email);
                    this.props.cookies.set(
                        {
                            url: "http://localhost",
                            name: "username",
                            domain: "localhost",
                            value: this.state.email
                        },
                        err => {
                            if (err) console.log("Error Setting Cross-Session Username");
                        }
                    );
                }
            }
        );
    }

    authorizeUser() {
        //Set Default Headers
        return request.defaults({
            json: true,
            headers: {
                authorization: "JWT " + this.state.token
            }
        });
    }

    hideOverlay() {
        this.setState({ isOpen: false });
    }

    render() {
        return (
            this.state.isOpen && (
                <div
                    className="login-box"
                    ref={login_box => (this.login_box = login_box)}
                >
                    <div className="login-box-container">
                        {/* Login Failed */}
                        <Alert
                            isOpen={this.state.showLoginError}
                            onConfirm={() => {
                                this.setState({ showLoginError: false });
                            }}
                        >
                            <h3 className="algin-center">
                                Username or Password Does not Match! {this.errorMessage}{" "}
                            </h3>
                        </Alert>
                        <h3 className="text-center">Login To The Chat Server!</h3>{" "}
                        <div className="form-group">
                            <label htmlFor="email">Username</label>
                            <input
                                name="email"
                                type="text"
                                className="form-control"
                                onChange={this.handleEmailChange.bind(this)}
                                ref={emailInput => (this.emailInput = emailInput)}
                                placeholder="Email"
                            />{" "}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                name="password"
                                type="password"
                                className="form-control"
                                onChange={this.handlePasswordChange.bind(this)}
                                ref={passInput => (this.passInput = passInput)}
                                placeholder="Password"
                            />{" "}
                        </div>
                        <button
                            type="button"
                            className="btn btn-success btn-block"
                            onClick={this.handleLoginSubmit.bind(this)}
                        >
                            Login{" "}
                        </button>{" "}
                        <a href="#" onClick={this.props.handleRegisterClick}>
                            If you are New to the Team, Please Register{" "}
                        </a>{" "}
                    </div>{" "}
                </div>
            )
        );
    }
}