process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 1;
require("dotenv").config();
const mongoose = require("mongoose");
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
bot.on("polling_error", console.log);
initializeLibFunctions(bot);

let members = membersJson;

const refetchMemberList = async () => {
  const availableMembers = await Member.find({ available: true }).lean().exec();
  members = availableMembers;
};

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to db");
    refetchMemberList();
  })
  .catch((err) => console.log("error in connecting to db" + err));

const helpMessage =
  "Choose the name of your crush and hit enter. You have nothing to lose!";
bot.onText(/\/start/, (msg) => {
  startController(bot, msg);
});

bot.onText(/\/help/, async (msg) => {
  bot.sendMessage(msg.chat.id, helpMessage);
});

bot.onText(/\/send/, async (msg) => {
  sendController(bot, msg);
});

bot.on("inline_query", (msg) => {
  const query = msg.query.toLowerCase();
  let matchedMembers = [];
  let count = 0;
  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    if (m.searchString.includes(query) || m.searchString.includes(query)) {
      const newMember = {
        id: m.userId,
        type: "article",
        thumb_url: `${process.env.BASE_URL}/${m.userId}.jpg`,
        thumb_width: 6,
        thumb_height: 6,
        title: m.fullName,
        description: m.userName,
        message_text: `/send ${m.userId}`,
      };
      matchedMembers.push(newMember);
      count++;
    }
    if (count === 7) {
      break;
    }
  }
  bot.answerInlineQuery(msg.id, matchedMembers, { cache_time: 1200 });
});

bot.onText(/\/removeme/, async (msg) => {
  removeController(bot, msg);
});

bot.onText(/\/faq/, (msg) => {
  faqController(bot, msg);
});
module.exports = { refetchMemberList };
