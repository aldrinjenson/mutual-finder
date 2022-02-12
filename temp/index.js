require("dotenv").config();
const fs = require("fs");
// const members = require("../scraper/members.json");
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot("1835355217:AAEI_y3rqagYGctMfnvKQtVn8R2__M4mBKU", {
  polling: true,
});

const sleep = (delay) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};
let count = 0;
bot.on("message", (msg) => {
  console.log(msg);
});
const main = async () => {
  console.log("hi");
  bot
    .sendMessage(945086573, "test")
    .then((res) => console.log("msg sent: "))
    .catch((err) => console.log("error: " + err));
  bot
    .getUserProfilePhotos(725632032)
    .then((r) => console.log(r))
    .catch((err) => console.log("error: " + err));

  // for (const m of members) {
  //   try {
  //     m.searchString = (
  //       m.fullName.toLowerCase() +
  //       " " +
  //       m.userName.toLowerCase()
  //     ).trim();

  //     delete m.imgPath;
  //     const { photos } = await bot.getUserProfilePhotos(m.userId.toString());
  //     console.log();

  //     if (photos.length !== 0) {
  //       const photoId = photos[0][0].file_id;
  //       const photoLink = await bot.getFileLink(photoId);
  //       console.log(photoLink);
  //       m.imgUrl = photoLink;
  //     } else {
  //       console.log("photo Not available");
  //       m.imgUrl = "";
  //     }
  //     count++;
  //     if (count % 10 === 0) {
  //       await sleep(2000);
  //     }
  //   } catch (err) {
  //     console.log("Error: " + err);
  //   }
  // }
  // fs.writeFileSync("./members_new.json", JSON.stringify(members));
};
main();
