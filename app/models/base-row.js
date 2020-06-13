const {YoutubeApi} = require("../youtube-api");

class BaseRow {
    constructor(data) {
        this.data = data;
    }

    getData() {
        return this.data;
    }

    getYoutubeApi() {
        if (!this.youtubeApi) this.youtubeApi = new YoutubeApi();

        return this.youtubeApi;
    }
}

module.exports = {BaseRow};