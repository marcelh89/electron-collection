import React from "react";
import axios from "axios";
import { checkEmail } from "../utils/utils";


export default class RegisterBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: "",
            username: "",
            email: "",
            password: ""
        };
    }

    handleFullnameChange(e) {
        this.setState({ fullName: e.target.value });
    }

    /*On Change for Inputs*/
    handleUsernameChange(e) {
        this.setState({ username: e.target.value });
    }

    handleEmailChange(e) {
        this.setState({ email: e.target.value });
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    handleRegisterSubmit(e) {
        //Email Verification REGEX Inputs Validation
        if (!this.state.fullName) {
            alert("Please Enter Your FullName");
            return false;
        }
        if (!this.state.username) {
            alert("Please Enter Your Username");
            return false;
        }
        if (!this.state.email) {
            alert("Please Enter Your Email");
            return false;
        }
        if (!checkEmail(this.state.email)) {
            alert("Please Enter A Valid Email Address!");
            return false;
        }
        if (!this.state.password) {
            alert("Please Enter Your Password");
            return false;
        }
        if (this.state.password.length < 8) {
            alert("Please Make Sure that your password is at least is length of 8");
            return false;
        }

        let formData = {
            fullName: this.state.fullName,
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        };

        console.log("FORM DATA: ", formData);

        //Send Register Request
        axios
            .post("http://localhost:3000/user/register", formData)
            .then(res => {
                if (res.data.status == "success" && res.status == 200) {
                    //Success
                    alert("User Registered Successfully!");
                    this.props.handleLoginClick();

                } else if (res.data.status == "error") {
                    alert("Error, Cannot Register User, Please Try Again!");
                } else {
                    alert("Error, something else happened during registration!");
                }
            })
            .catch(e => {
                if (e) {
                    alert("Error Registering User!");
                    console.log("User Registration EROROR: ", e);
                }
            });
    }

    render() {
        return (
            <div className="login-box">
                <div className="login-box-container">
                    <h3 className="text-center">Register To The Chat</h3>{" "}
                    <div className="form-group">
                        <label htmlFor="registerFullname">FullName</label>{" "}
                        <input
                            type="text"
                            name="registerFullname"
                            className="form-control"
                            onChange={this.handleFullnameChange.bind(this)}
                            ref={fullNameInput => (this.fullNameInput = fullNameInput)}
                            placeholder="Full Name"
                        />{" "}
                    </div>{" "}
                    <div className="form-group">
                        <label htmlFor="registerUsername">UserName</label>{" "}
                        <input
                            type="text"
                            name="registerUsername"
                            className="form-control"
                            onChange={this.handleUsernameChange.bind(this)}
                            ref={usrnameInput => (this.usrnameInput = usrnameInput)}
                            placeholder="Username"
                        />{" "}
                    </div>{" "}
                    <div className="form-group">
                        <label htmlFor="registerEmail">Email</label>{" "}
                        <input
                            type="text"
                            name="registerEmail"
                            className="form-control"
                            onChange={this.handleEmailChange.bind(this)}
                            ref={emailInput => (this.emailInput = emailInput)}
                            placeholder="Email"
                        />{" "}
                    </div>{" "}
                    <div className="form-group">
                        <label htmlFor="registerPassword">Password</label>{" "}
                        <input
                            type="Password"
                            name="registerPassword"
                            className="form-control"
                            onChange={this.handlePasswordChange.bind(this)}
                            ref={passInput => (this.passInput = passInput)}
                            placeholder="Password"
                        />{" "}
                    </div>{" "}
                    <button
                        type="submit"
                        className="btn btn-success btn-block"
                        onClick={this.handleRegisterSubmit.bind(this)}
                    >
                        Register{" "}
                    </button>{" "}
                    <a href="#" onClick={this.props.handleLoginClick}>
                        Already a Member, Login
          </a>{" "}
                </div>{" "}
            </div>
        );
    }
}