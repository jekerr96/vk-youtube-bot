const {VideoRow} = require("./video-row");
const {BaseRow} = require("./base-row");
const {User} = require("./user");

class ChannelRow extends BaseRow {
    getId() {
        return this.data.id;
    }

    getName() {
        return this.data.snippet.title;
    }

    async getLastVideo() {
        if (this.lastVideo) return this.lastVideo;

        let video = await this.getYoutubeApi().getLastVideo(this);

        if (!video) return false;

        let videoRow = new VideoRow(video.items[0]);
        this.lastVideo = videoRow;

        return videoRow;
    }

    getPlaylistUploadsId() {
        return this.data.contentDetails.relatedPlaylists.uploads;
    }

    getSavedTimeLastVideo() {
        return this.data.lastTimeVideo ? this.data.lastTimeVideo : 0;
    }

    async hasNewVideo() {
        let time = this.getSavedTimeLastVideo();
        let lastVideo = await this.getLastVideo();

        if (!lastVideo) return false;

        let lastTime = lastVideo.getTime();

        let hasNew = lastTime > time;

        if (hasNew) {
            this.updateLastTimeVideo(lastTime);
        }

        return hasNew;
    }

    async updateLastTimeVideo(time) {
        const {Channel} = require("./channel");
        let channelModel = new Channel();
        channelModel.update({id: this.getId()}, {$set: {lastTimeVideo: time}});
    }

    getSubscribedUsers() {
        let userModel = new User();

        return userModel.getUsersByChannelId(this.getId());
    }
}

module.exports = {ChannelRow};