import React from "react";

export default class ChatInputBar extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      text: "",
      typing: false,
      inputID: "chat-input",
      buttonID: "chat-submit",
      formID: "chat-form",
      timer: null
    };
  }

  getState() {
    return this.state;
  }

  handleOnChange(e) {
    //Clear The Previous Timeout
    this.setState(prevState => {
      clearTimeout(this.state.timer);
    });
    this.setState({ typing: true, text: e.target.value, input: e.target });
    //Emit Store Typing Event
    this.props.ChatStore.setTyping(true);
    //Clear Time Out
    clearTimeout(this.timer);
    //Not Typing after 1sec of in-activity!
    this.timer = setTimeout(() => {
      this.setState({ typing: false });
        this.props.ChatStore.setTyping(false);
    }, 1000); ///< Change State After One Second of IDLE
  }

  handleSubmit(e) {
    e.preventDefault();

    //Store Message
      this.props.ChatStore.addMessage(this.state.text);

    this.state.input.value = ""; ///< Empty Input Field
  }

  render() {
    return (
      <div id="chat-bar-container">
        <form
          id={this.state.formID}
          action=""
          onSubmit={this.handleSubmit.bind(this)}
        >
          <input
            id={this.state.inputID}
            className="form-control"
            type="text"
            placeholder="Type Your Message..."
            onChange={this.handleOnChange.bind(this)}
          />{" "}
          <button
            id={this.state.buttonID}
            type="submit"
            className="btn btn-success"
          >
            Send Message{" "}
          </button>{" "}
        </form>{" "}
      </div>
    );
  }
}