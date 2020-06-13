const {BaseRow} = require("./base-row");

class VideoRow extends BaseRow {
    getId() {
        return this.data.id;
    }

    getChannelId() {
        return this.data.snippet.channelId;
    }

    getName() {
        return this.data.snippet.title;
    }

    getThumbnailUrl() {
        return this.data.snippet.thumbnails.standard.url;
    }

    getTime() {
        return Date.parse(this.data.snippet.publishedAt);
    }

    getLink() {
        return "https://www.youtube.com/watch?v=" + this.getId();
    }
}

module.exports = {VideoRow};