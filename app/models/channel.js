const {VideoRow} = require("./video-row");
const {ChannelRow} = require("./channel-row");
const {BaseModel} = require("./base-model");

class Channel extends BaseModel {
    async getChannelByIdOrName(search) {
        let channel = await this.collection.findOne({$or: [{id: search}, {userName: search}]});

        if (channel) return new ChannelRow(channel);

        channel = await this.getYoutubeApi().getChannelByIdOrName(search);

        if (!channel) return false;

        let channelRow = new ChannelRow(channel.items[0]);

        let lastVideo = await channelRow.getLastVideo();

        await this.collection.insertOne({
            id: channelRow.getId(),
            ...channelRow.getData(),
            lastTimeVideo: lastVideo ? lastVideo.getTime() : 0,
            userName: search,
        });

        return channelRow;
    }

    async getChannels() {
        let channels = await this.collection.find().toArray();
        let channelsRow = [];

        for (const channel of channels) {
            channelsRow.push(new ChannelRow(channel));
        }

        return channelsRow;
    }

    async parseChannelId(text) {
        let channelId;

        if (/\/channel\//.test(text)) {
            channelId = text.match(/channel\/(.+$)/)[1];
        } else if (/\/user\//.test(text)) {
            channelId = text.match(/user\/(.+$)/)[1];
        } else if (/\/watch\?v=/.test(text)) {
            let videoId = text.match(/\/watch\?v=(.+$)/)[1];
            let youtubeApi = this.getYoutubeApi();
            let video = await youtubeApi.getVideoById(videoId);

            if (!video) return text;

            video = new VideoRow(video.items[0]);
            channelId = video.getChannelId();
        }

        return channelId ? channelId : text;
    }

    getCollectionName() {
        return "channels";
    }
}

module.exports = {Channel};