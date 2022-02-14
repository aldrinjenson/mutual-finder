process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 1;
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const membersJson = {};
const { initializeLibFunctions } = require("./utils/lib");
const {
  faqController,
  removeController,
  sendController,
  startController,
  feedbackController,
} = require("./contoller");
const { Member } = require("./models");
const endMessage = require("./contoller/utils");

// initial config
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const app = express();
app.use(express.json());
const placeHolderImage =
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.n1C1oxOvYLLyDIavrBFoNQHaHa%26pid%3DApi&f=1";
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
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, endMessage);
  // startController(bot, msg, list);
});

bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(msg.chat.id, helpMessage);
  await bot.sendMessage(chatId, endMessage);
});

bot.onText(/\/send/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, endMessage);
  // sendController(bot, msg);
});

bot.on("inline_query", (msg) => {
  const query = msg.query.toLowerCase();
  const members = list.members;

  let matchedMembers = [];
  let count = 0;
  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    if (m.searchString.includes(query)) {
      const newMember = {
        id: m.chatId,
        type: "article",
        thumb_url: m.photoExists
          ? `${process.env.BASE_URL}/${m.userId}.jpg`
          : placeHolderImage,
        thumb_width: 6,
        thumb_height: 6,
        title: m.fullName,
        description: m.username,
        message_text: `/send ${m.chatId}`,
      };
      matchedMembers.push(newMember);
      count++;
    }

    if (count === 3) {
      break;
    }
  }
  bot.answerInlineQuery(msg.id, matchedMembers);
});

bot.onText(/\/togglestatus/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, endMessage);
  // removeController(bot, msg, list);
});

bot.onText(/\/faq/, (msg) => {
  faqController(bot, msg);
});

bot.onText(/\/feedback/, (msg) => {
  feedbackController(bot, msg);
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

const sleep = (delay) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });

app.post("/broadcast", async (req, res) => {
  const msg = req.body?.msg;
  if (!msg) {
    res.send("message content required!");
  }
  const allMembers = await Member.find({}).lean().exec();
  for (let i = 0; i < allMembers.length; i++) {
    const m = allMembers[i];
    bot.sendMessage(m.chatId, msg, { disable_web_page_preview: true });
    if (i % 15 === 0) {
      await sleep(3000);
    }
  }
  res.send("ok");
});

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log("server active on port " + PORT));
