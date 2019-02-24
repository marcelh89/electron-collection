/*const io = require('socket.io-client');

let socket = io('http://localhost:3000');

socket.emit("newMessage", "Hello There");*/

import React from "react";
import ReactDOM from "react-dom";

let root = document.getElementById("root");

document.addEventListener("DOMContentLoaded", e => {
    ReactDOM.render(<TestComponent />, root);

});

class TestComponent extends React.Component {
    constructor(props){
        super(props);
    }

    render(){

        return (
            <div>
                <h3>Hello from the other side</h3>
            </div>
        );

    }
}

