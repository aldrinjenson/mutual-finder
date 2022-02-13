const { Request, Member } = require("../models");
const { getAnswerFromButtonGroup } = require("../utils/lib");

const removeController = async (bot, msg, list) => {
  const chatId = msg.chat.id;
  const member = await Member.findOne({ chatId }).lean().exec();

  const isAvailable = member.available;
  await bot.sendMessage(
    chatId,
    `You current status is ${isAvailable ? "Available" : "Unavailable"}`
  );
  const confirmButtons = ["Yes, toggle status", "No, Cancel"];
  const confirmToggle = await getAnswerFromButtonGroup(
    {
      key: "confirmToggle",
      prompt: `Toggle status?`,
      buttons: confirmButtons,
      condition: (val) => confirmButtons.includes(val),
      formatter: (val) => val === confirmButtons[0],
    },
    chatId,
    bot
  );
  if (confirmToggle) {
    try {
      const updatedMember = await Member.findOneAndUpdate(
        { userId: chatId },
        { available: !isAvailable }
      ).exec();
      let updatedMsg = `Status updated to ${
        updatedMember.available ? "Available" : "Unavailable"
      }`;
      if (!updatedMember.available) {
        updatedMsg +=
          "\nYour name will not be visible in the list unless toggled back!";
      }
      bot.sendMessage(
        chatId,
        `${updatedMsg}\nEnter /togglestatus to change status again`
      );
      Member.find({ available: true })
        .lean()
        .exec()
        .then(async (r) => {
          const requestsReceivedToThisUser = await Request.find({
            toId: chatId,
          })
            .lean()
            .exec();
          requestsReceivedToThisUser.forEach((r) => {
            bot.sendMessage(
              r.fromId,
              `Hi, this is to let you know that ${
                r.toUserName
              } has changed their availability status to ${
                updatedMember.available ? "Available" : "Unavailable"
              }`
            );
          });
          const availableMembers = await Member.find({ available: true })
            .lean()
            .exec();
          list.members = availableMembers;
        });
      await Request.updateMany({ toId: chatId }, { invalid: true }).exec();
    } catch (err) {
      console.log("Error in making unavilable: " + err);
    }
  }
};

module.exports = removeController;
