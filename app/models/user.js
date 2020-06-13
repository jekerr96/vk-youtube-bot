const {UserRow} = require("./user-row");
const {BaseModel} = require("./base-model");

class User extends BaseModel {
    async getUser(peerId) {
        let user = await this.collection.findOne({peerId});

        if (user) return new UserRow(user);

        user = {
            peerId,
            subscribes: [],
        };

        await this.collection.insertOne(user);

        return new UserRow(user);
    }

    async getUsersByChannelId(id) {
        let users = await this.collection.find({subscribes: id}).toArray();

        let usersRow = [];

        users.forEach(user => {
            usersRow.push(new UserRow(user));
        });

        return usersRow;
    }

    sendMultipleMessages(users = [], message) {
        let ids = [];

        for (const user of users) {
            ids.push(user.getId());
        }

        global.vkBot.sendMessage(ids, message);
    }

    async subscribeUser(channelId, user) {
        let subscribes = user.getSubscribes();
        let exist = subscribes.find(subscribe => {
            return subscribe === channelId;
        });

        if (exist) return false;

        subscribes.push(channelId);
        await this.update({peerId: user.getId()}, {$set: {subscribes}});

        return true;
    }

    async unsubscribeUser(channelId, user) {
        let subscribes = user.getSubscribes();
        let exist = subscribes.findIndex(subscribe => {
            return subscribe === channelId;
        });

        if (exist === -1) return false;

        subscribes.splice(exist, 1);
        await this.update({peerId: user.getId()}, {$set: {subscribes}});

        return true;
    }

    getCollectionName() {
        return "users";
    }
}

module.exports = {User};