import React from "react";

export default (props) => {
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