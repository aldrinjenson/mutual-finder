const startMsg = `Press the start button and try searching the name of your crush. Once you select your special person, you'll have an option to send a special message to give them some hints about you. There will be a final confirmation at the end as well before any message is sent.`;
const { Member } = require("../models");
const axios = require("axios");

const imageBaseUrl = process.env.BASE_URL;
const sendFileToDownload = async (imgUrl, userId) => {
  axios
    .get(imageBaseUrl + "/download", {
      params: {
        url: imgUrl,
        userId,
      },
    })
    .then(() => console.log("profile updated"))
    .catch((err) => console.log("error in updating profile: "));
};
// sendFileToDownload(
//   "https://api.telegram.org/file/bot1835355217:AAEI_y3rqagYGctMfnvKQtVn8R2__M4mBKU/photos/file_1.jpg",
//   43211
// );

const startController = async (bot, msg, list) => {
  const chatId = msg.chat.id;
  const memberCount = await Member.count({ available: true });
  bot.sendMessage(
    chatId,
    `Search for your special person from ${memberCount} members`
  );

  const member = await Member.findOne({ chatId }).lean().exec();

  const { first_name, last_name, username, id: userId } = msg.from;
  let fullName = first_name || " ";
  if (last_name) {
    fullName += " " + last_name;
  }
  let searchString = fullName.toLowerCase();
  if (username) {
    searchString += " " + username.toLowerCase();
  }

  if (!member) {
    const { photos } = await bot.getUserProfilePhotos(msg.from.id, {
      limit: 1,
    });
    if (photos.length !== 0) {
      const photoUrl = await bot.getFileLink(photos[0][0].file_id);
      sendFileToDownload(photoUrl, userId);
    }
    const newMember = new Member({
      username,
      chatId,
      userId,
      fullName: fullName || username,
      searchString,
      imgUrl: photos.length ? await bot.getFileLink(photos[0][0].file_id) : "",
      photoExists: photos.length !== 0,
      available: true,
      allStrikesOut: false,
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
  } else if ((new Date() - member.updatedAt) / (1000 * 60 * 60) > 1) {
    const { photos } = await bot.getUserProfilePhotos(msg.from.id, {
      limit: 1,
    });
    if (photos.length !== 0) {
      const photoUrl = await bot.getFileLink(photos[0][0].file_id);
      sendFileToDownload(photoUrl, userId);
    }
    Member.findByIdAndUpdate(member._id, {
      username,
      fullName: fullName || username,
      searchString,
      imgUrl: "", // will be fixed from heroku🤞
      photoExists: photos.length !== 0,
    })
      .then(() => console.log("member details updated due to time > 1hr"))
      .catch(() => console.log("error in updating"));
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
