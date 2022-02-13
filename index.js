process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 1;
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const membersJson = require("./members.json");
const { initializeLibFunctions } = require("./utils/lib");
const {
  faqController,
  removeController,
  sendController,
  startController,
} = require("./contoller");
const { Member } = require("./models");

// initial config
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const app = express();
bot.on("polling_error", console.log);
initializeLibFunctions(bot);

let list = { members: membersJson };

const refetch = async () => {
  const availableMembers = await Member.find({ available: true }).lean().exec();
  list.members = availableMembers;
};
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to db");
    refetch();
  })
  .catch((err) => console.log("error in connecting to db" + err));

const helpMessage = `Chose the special person you have feelings for. Let them know that someone cares about them. Give as much information about you as you want. All messages are private and secure. If they identifies you, both of you will be notified and you can spend Valentine's day together. Else your name won't be revealed as well. One person can send maximum 3 messages. Read faqs with /faq. Enter /start to begin.\nCommands Available:\nstart - start the bot
help - show help instruction
faq - show faqs
removeme - remove your participation and make yourself unavailable`;

bot.onText(/\/start/, async (msg) => {
  startController(bot, msg, list);
});

bot.onText(/\/help/, async (msg) => {
  bot.sendMessage(msg.chat.id, helpMessage);
});

bot.onText(/\/send/, async (msg) => {
  sendController(bot, msg);
});

bot.on("inline_query", (msg) => {
  const query = msg.query.toLowerCase();
  const members = list.members;

  let matchedMembers = [];
  let count = 0;
  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    if (m.searchString.includes(query) || m.searchString.includes(query)) {
      const newMember = {
        id: m.chatId,
        type: "article",
        thumb_url: `${process.env.BASE_URL}/${m.userId}.jpg`,
        thumb_width: 6,
        thumb_height: 6,
        title: m.fullName,
        description: m.userName,
        message_text: `/send ${m.chatId}`,
      };
      matchedMembers.push(newMember);
      count++;
    }

    if (count === 7) {
      break;
    }
  }
  bot.answerInlineQuery(msg.id, matchedMembers);
});

bot.onText(/\/removeme/, async (msg) => {
  removeController(bot, msg, list);
});

bot.onText(/\/faq/, (msg) => {
  faqController(bot, msg);
});

app.get("/", (req, res) => {
  res.send("server active");
});
app.get("/refetch", (req, res) => {
  refetch()
    .then(() => {
      res.send("list updated");
    })
    .catch((err) => res.send("Error in updating: " + err));
});
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log("server active on port " + PORT));
