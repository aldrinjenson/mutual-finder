const botName = "TgSongBot";
const startMsg = `This is a simple telegram bot which does one thing. It'll help you find if there is a mutual connection between you and your crush\n Simple choose the name of your crush and then add an extra msg which will make the bot send a message anonymously to your crush saying that someone is having a crush on her. She can then enter the name of someone whom she has a crush on. If the name matches your name, both of you will be notified and you can go to the Valentin'es party together. Otherwise, if the match is wrong, both will be notified saying that it was the wrong person.\nStart by pressing @${botName}`;

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
