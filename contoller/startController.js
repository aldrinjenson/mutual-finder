const botName = "TgSongBot";
const startMsg = `Press the start button and try searching the name of your crush. Once you select your special person, you'll have an option to send a special message to give them some hints about you. There will be a final confirmation at the end as well before any message is sent.`;
const { Member } = require("../models");

const startController = async (bot, msg, list) => {
  const chatId = msg.chat.id;
  const member = await Member.findOne({ chatId }).lean().exec();
  const { first_name, last_name, userName, id: userId } = msg.from;

  if (!member) {
    const { photos } = await bot.getUserProfilePhotos(msg.from.id, {
      limit: 1,
    });
    const fullName = first_name + " " + last_name || "";
    const newMember = new Member({
      userName,
      chatId,
      userId,
      fullName: fullName || username,
      searchString: fullName.toLowerCase() + " " + userName?.toLowerCase(),
      imgUrl: photos.length ? await bot.getFileLink(photos[0][0].file_id) : "",
      photoExists: photos.length !== 0,
      available: true,
    });
    newMember
      .save()
      .then(async (r) => {
        console.log("new member saved");
        const availableMembers = await Member.find({ available: true })
          .lean()
          .exec();
        list.members = availableMembers;
      })
      .catch((err) => console.log("error in saving and refetching: " + err));
  }
  bot.sendMessage(chatId, startMsg, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "start", switch_inline_query_current_chat: "" }],
      ],
    },
  });
};

module.exports = startController;
