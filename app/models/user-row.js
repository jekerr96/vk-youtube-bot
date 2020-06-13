const {BaseRow} = require("./base-row");

class UserRow extends BaseRow {
    getId() {
        return this.data.peerId;
    }

    sendMessage(text) {
        this.getBot().sendMessage(this.getId(), text);
    }

    getSubscribes() {
        return this.data.subscribes;
    }

    getBot() {
        return global.vkBot;
    }
}

module.exports = {UserRow};