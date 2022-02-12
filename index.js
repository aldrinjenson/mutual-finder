process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 1;
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const members = require("./scraper/members.json")
const { initializeLibFunctions } = require("./utils/lib");

// tg-bot begin
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
initializeLibFunctions(bot);

const helpMessage =
  "Choose the name of your crush and hit enter. You have nothing to lose!";
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const resp =
    "This is a simple telegram bot which does one thing. It'll help you find if there is a mutual connection between you and your crush\n Simple choose the name of your crush and then add an extra msg which will make the bot send a message anonymously to your crush saying that someone is having a crush on her. She can then enter the name of someone whom she has a crush on. If the name matches your name, both of you will be notified and you can go to the Valentin'es party together. Otherwise, if the match is wrong, both will be notified saying that it was the wrong person.";
  bot.sendMessage(chatId, resp);
});

// bot.onText(/''/, (msg) => {
//   console.log(msg);
// });

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, helpMessage);
});

bot.onText(/\/browse/, (msg) => {
  browseProducts(msg, bot);
});

bot.on("message", (msg) => {
  console.log(msg);
});

const main = async () => {
  console.log(members.length);
  
  // const { photos } = await bot.getUserProfilePhotos(945086573);
  // const photo = photos[0][0];
  // const url = await bot.getFileLink(photo.file_id);
  // console.log(url);
  // const memberData = [];
  // for (let i = 0; i < 10; i++) {
  //   const member = members[i];
  //   const photoFile = (await bot.getUserProfilePhotos(member.userId))[0][0];
  //   const obj = { ...member };
  //   const photoUrl = await bot.getFileLink(photoFile.file_id);
  //   obj.photoUrl = photoUrl;
  // }
  // const url = await bot.getFileLink(photo.file_un)
  // bot.getUserProfilePhotos(945086573).then((res) => console.log(res.photos));
  // for( const member of members){
  //   bot.get
  // }
};
main();
