process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 1;
require("dotenv").config();
const mongoose = require("mongoose");
const TelegramBot = require("node-telegram-bot-api");
const { Member, Request } = require("./models");
const members = require("./scraper/members.json");
const {
  initializeLibFunctions,
  getAnswerFromButtonGroup,
  getAnswer,
  handleButtons,
} = require("./utils/lib");

// tg-bot begin
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
bot.on("polling_error", console.log);
initializeLibFunctions(bot);
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log("error in connecting to db" + err));

const botName = "TgSongBot";
const helpMessage =
  "Choose the name of your crush and hit enter. You have nothing to lose!";
bot.onText(/\/start/, (msg) => {
  console.log(msg);

  const chatId = msg.chat.id;
  const resp =
    "This is a simple telegram bot which does one thing. It'll help you find if there is a mutual connection between you and your crush\n Simple choose the name of your crush and then add an extra msg which will make the bot send a message anonymously to your crush saying that someone is having a crush on her. She can then enter the name of someone whom she has a crush on. If the name matches your name, both of you will be notified and you can go to the Valentin'es party together. Otherwise, if the match is wrong, both will be notified saying that it was the wrong person.\nStart by pressing @" +
    botName;
  bot.sendMessage(chatId, resp, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "start", switch_inline_query_current_chat: "" }],
      ],
    },
  });
});

bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, helpMessage);
  console.log(msg.from.id);
});

bot.onText(/\/send/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.text.split(" ")[1];

  if (userId == msg.from.id) {
    bot.sendMessage(chatId, "Seriously dude, Why you sending to yourself?🤦");
    return;
  }
  const requests = await Request.findOne({ userId: userId }).exec();
  // console.log(member);

  const { extraMsg } = await getAnswer(
    {
      key: "extraMsg",
      prompt: `Enter an extra message to add. eg: "I'm your classmate and I don't talk very much, but I really like you!\nEnter . to skip." `,
      formatter: (val) => (val === "." ? null : val),
    },
    chatId,
    bot
  );

  const confirmButtons = ["Yes, Nothing to lose🤞", "No, I'm good with myself"];
  const confirmSendMessage = await getAnswerFromButtonGroup(
    {
      key: "shouldAddMoreProduct",
      prompt: `${extraMsg}\nDo you want to confirm this anonymous request to ${
        member?.fullName || member?.userName
      }?`,
      buttons: confirmButtons,
      condition: (val) => confirmButtons.includes(val),
      formatter: (val) => val === confirmButtons[0],
    },
    chatId,
    bot
  );
  if (confirmSendMessage) {
    bot.sendMessage(
      member.userId,
      `Hi, this is to let you know that you are having a crush!\nHere's the extra information added by your crush: ${extraMsg}\nEnter /start to search for the list and find the one person you think could be a match on Valentin'e day. If the name matches, both of you will be notified. Else, nothing!`
    );
    bot.sendMessage(
      chatId,
      `Message has been sent to ${member?.fullName || member?.userName}`
    );
  } else {
    bot.sendMessage(chatId, "Cancelled.\nTry /start to try again.");
  }
});

bot.on("inline_query", (msg) => {
  const query = msg.query.toLowerCase();

  let matchedMembers = [];
  let count = 0;
  const baseUrl = "http://13.126.15.83:8080";
  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    if (m.searchString.includes(query) || m.searchString.includes(query)) {
      const newMember = {
        id: m.userId,
        type: "article",
        thumb_url: `${baseUrl}/${m.userId}.jpg`,
        thumb_width: 6,
        thumb_height: 6,
        title: m.fullName,
        description: m.userName,
        message_text: `/send ${m.userId}`,
      };
      matchedMembers.push(newMember);
      count++;
    }
    if (count == 5) {
      break;
    }
  }
  console.log(matchedMembers);

  bot.answerInlineQuery(msg.id, matchedMembers, { cache_time: 1200 });
});
