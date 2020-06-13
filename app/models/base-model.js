const {YoutubeApi} = require("../youtube-api");

class BaseModel {
    constructor() {
        this.collection = {};

        const collectionName = this.getCollectionName();

        if (!collectionName) throw new Error("Collection name is undefined");

        this.collection = global.dbConnection.collection(collectionName);
    }

    update(filter, params) {
        return this.collection.updateOne(filter, params);
    }

    getCollectionName() {
        return undefined;
    }

    getYoutubeApi() {
        if (!this.youtubeApi) this.youtubeApi = new YoutubeApi();

        return this.youtubeApi;
    }
}

module.exports = {BaseModel};