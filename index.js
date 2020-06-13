const MongoDb = require("./app/db/connect");
const {Channel} = require("./app/models/channel");
const VkBot = require("node-vk-bot-api");
const {User} = require("./app/models/user");

let channelModel;
let userModel;
let intervalTime = 1000 * 60 * 5;

(async () => {
    global.dbConnection = await MongoDb.getConnection();
    global.vkBot = new VkBot("3e5feb1e40663e0082b251261ffffc783ad604f13758a9b64f84f7a343adb28e3483b7f78ec22c1faba01");
    global.vkBot.sendMessage(69305433, "Bot has been started");
    channelModel = new Channel();
    userModel = new User();

    global.vkBot.command("мои подписки", async (ctx) => {
        let user = await userModel.getUser(ctx.message.peer_id);
        let subscribes = user.getSubscribes();
        let subscribeList = "";

        for (const subscribe of subscribes) {
            let channel = await channelModel.getChannelByIdOrName(subscribe);
            subscribeList += channel.getName() + "\n";
        }

        ctx.reply(subscribeList);
    });

    global.vkBot.on(async (ctx) => {
        let channelId = await channelModel.parseChannelId(ctx.message.text);
        let peerId = ctx.message.peer_id;
        let user = await userModel.getUser(peerId);
        let channel = await channelModel.getChannelByIdOrName(channelId);

        if (!channel) {
            ctx.reply("Канал не найден");
            return;
        }

        if (/отписаться/i.test(ctx.message.text)) {
            await unsubscribe(ctx, user, channel);
        } else {
            await subscribe(ctx, user, channel);
        }
    });

    global.vkBot.startPolling();
    console.log("server start with interval " + intervalTime);
    await check();

    setInterval(() => {
        check();
    }, intervalTime);
})();

async function check() {
    console.log("check");
    let channels = await channelModel.getChannels();

    for (const channel of channels) {
        let hasNewVideo = await channel.hasNewVideo();

        if (!hasNewVideo) continue;

        let users = await channel.getSubscribedUsers();
        let video = await channel.getLastVideo();

        if (!video) continue;

        for (const user of users) {
            user.sendMessage("Привет\nНа канале " + channel.getName() + " новое видео\n" + video.getName() + "\n" + video.getLink());
        }
    }
}

async function subscribe(ctx, user, channel) {
    let subscribeResult = await userModel.subscribeUser(channel.getId(), user);

    ctx.reply(subscribeResult ? "Вы подписались на канал " + channel.getName() : "Вы уже подписаны");
}

async function unsubscribe(ctx, user, channel) {
    let subscribeResult = await userModel.unsubscribeUser(channel.getId(), user);

    ctx.reply(subscribeResult ? "Вы отписались от канала " + channel.getName() : "Вы не подписаны на канал " + channel.getName());
}