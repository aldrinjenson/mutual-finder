const { Request, Member } = require("../models");
const { getAnswerFromButtonGroup } = require("../utils/lib");

const removeController = async (bot, msg, list) => {
  const chatId = msg.chat.id;
  const confirmButtons = ["Yes, Remove me", "No, Cancel"];
  const confirmRemove = await getAnswerFromButtonGroup(
    {
      key: "confirmRemove",
      prompt: `Are you sure, you want to remove yourself?\nThis process is irriversible. Maybe check out /faq once.`,
      buttons: confirmButtons,
      condition: (val) => confirmButtons.includes(val),
      formatter: (val) => val === confirmButtons[0],
    },
    chatId,
    bot
  );
  if (confirmRemove) {
    try {
      await Member.findOneAndUpdate(
        { userId: msg.from.id },
        { available: false }
      ).exec();
      Member.find({ available: true })
        .lean()
        .exec()
        .then(async (r) => {
          bot.sendMessage(
            chatId,
            "You have been successfully removed from the list."
          );
          const requestsReceivedToThisUser = await Request.find({
            toId: msg.from.id,
          })
            .lean()
            .exec();
          requestsReceivedToThisUser.forEach((r) => {
            bot.sendMessage(
              r.fromId,
              `Hi, this is to let you know that ${r.toUserName} has made themeselves unavailable by removing themselves.`
            );
          });
          const availableMembers = await Member.find({ available: true })
            .lean()
            .exec();
          list.members = availableMembers;
        });
      await Request.updateMany({ toId: msg.from.id }, { invalid: true }).exec();
    } catch (err) {
      console.log("Error in making unavilable: " + err);
    }
  }
};

module.exports = removeController;
