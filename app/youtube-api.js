const axios = require('axios');

class YoutubeApi {
    constructor() {
        this.BASE_URL = "https://www.googleapis.com/youtube/v3/";
        this.API_KEY = "AIzaSyABV-GrN76SjFni9RyfCkMYo5DfthFzmsc";
        this.CHANNELS_URL = "channels";
        this.PLAYLIST_ITEMS_URL = "playlistItems";
        this.VIDEOS_URL = "videos";
    }

    async getChannelByIdOrName(search) {
        let channel = await this.makeRequest(this.CHANNELS_URL, {
            id: encodeURI(search),
            part: "contentDetails,snippet",
        });

        if (channel.data.pageInfo.totalResults) return channel.data;

        channel = await this.makeRequest(this.CHANNELS_URL, {
            forUsername: encodeURI(search),
            part: "contentDetails,snippet",
        });

        if (!channel.data.pageInfo.totalResults) return false;

        return channel.data;
    }

    async getLastVideoId(channel) {
        let result = await this.makeRequest(this.PLAYLIST_ITEMS_URL, {
            playlistId: channel.getPlaylistUploadsId(),
            part: "contentDetails",
            maxResults: 1,
        });

        let video = false;

        if (result.data.pageInfo.totalResults) {
            video = result.data.items[0].contentDetails.videoId;
        }

        return video;
    }

    async getLastVideo(channel) {
        let result = await this.makeRequest(this.VIDEOS_URL, {
            id: await this.getLastVideoId(channel),
            part: "snippet",
        });

        if (!result.data.pageInfo.totalResults) return false;

        return result.data;
    }

    async getVideoById(id) {
        let result = await this.makeRequest(this.VIDEOS_URL, {
            id,
            maxResults: 1,
            part: "snippet",
        });

        if (!result.data.pageInfo.totalResults) return false;

        return result.data;
    }

    makeRequest(object, params) {
        let url = this.BASE_URL;
        url += object + "?";

        if (params) {
            for (let key in params) {
                if (!params.hasOwnProperty(key)) continue;
                url += key + "=" + params[key] + "&";
            }
        }

        url += "key=" + this.API_KEY;
        return axios.get(url);
    }
}

module.exports = {YoutubeApi};