const { Feedback } = require("../models");
const { getAnswer } = require("../utils/lib");

const feedbackController = async (bot, msg) => {
  const chatId = msg.chat.id;
  const { feedbackMsg } = await getAnswer(
    {
      key: "feedbackMsg",
      prompt: "Enter any feedback or suggestions you have",
    },
    chatId,
    bot
  );
  const newFeedback = new Feedback({
    feedbackMsg,
    fromUserChatId: chatId,
    fromUserName: msg.from.first_name,
  });
  const savedFeedback = await newFeedback.save();
  if (savedFeedback) {
    bot.sendMessage(chatId, "Your feedback has been received. Thank you");
  }
};
module.exports = feedbackController;
