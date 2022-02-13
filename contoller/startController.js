const botName = "TgSongBot";
const startMsg = `Press the start button and try searching the name of your crush. Once you select your special person, you'll have an option to send a special message to give them some hints about you. There will be a final confirmation at the end as well before any message is sent.`;

const startController = async (bot, msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, startMsg, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "start", switch_inline_query_current_chat: "" }],
      ],
    },
  });
};

module.exports = startController;
