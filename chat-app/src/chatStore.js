const EventEmitter = require("events").EventEmitter;

class ChatStore extends EventEmitter {

    constructor(){
        console.log("ChatStore.constructor");
        super();
        this.state = {
            messages : []
        }

    }

    addMessage(msg){
        console.log("ChatStore.addMessage");
        this.state.messages.push(msg);
        this.emit("new-message", msg);
    }

}

module.exports = new ChatStore();