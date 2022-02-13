const { Request, Member } = require("../models");
const { getAnswer, getAnswerFromButtonGroup } = require("../utils/lib");
const maxStrikes = 3;

const sendController = async (bot, msg) => {
  const chatId = msg.chat.id;
  const selectedUserId = +msg.text.split(" ")[1];

  // if (selectedUserId == msg.from.id) {
  //   bot.sendMessage(chatId, "Seriously dude, Why you sending to yourself?🤦");
  //   return;
  // }
  const requestsSentByThisUser = await Request.find({ fromId: msg.from.id })
    .lean()
    .exec();
  console.log(requestsSentByThisUser);

  if (requestsSentByThisUser.length === maxStrikes) {
    bot.sendMessage(
      chatId,
      `You've already used all your ${maxStrikes} chances.\n`
    );
    return;
  }
  const requestsReceivedToThisUser = await Request.find({ toId: msg.from.id })
    .lean()
    .exec();
  console.log({ selectedUserId, requestsReceivedToThisUser });

  const selectedUserMatch = requestsReceivedToThisUser.find(
    (m) => m.fromId === selectedUserId
  );
  console.log({ selectedUserMatch });
  const currUserName =
    msg.from.first_name ||
    "" + msg.from.last_name + "" ||
    "@" + msg.from.username;
  if (selectedUserMatch) {
    const { fromUserName, fromId: matchedUserId } = selectedUserMatch;
    const name = fromUserName;

    bot.sendMessage(
      chatId,
      `Congragulations, you've got a match!\nBoth you and ${name} can spend Valentine's day together❤️\nNotification sent to ${
        matchedUserId ? "@" + matchedUserId : name
      } informing the match.\nCongragultions!🔥`
    );
    bot.sendMessage(
      matchedUserId,
      `Congragulations, ${
        msg.from.username ? "@" + msg.from.username : currUserName
      } has found a match with you!\nNow go call them up and spend Valentine's day together!💯`
    );
    selectedUserMatch.matched = true;
    Request.findByIdAndUpdate(selectedUserMatch._id, { matched: true })
      .then((res) => console.log("request status updated"))
      .catch((err) => console.log("Error in updating request status: " + err));
    return;
  }

  const toMember = await Member.findOne({ userId: selectedUserId }).exec();
  console.log(toMember);

  if (requestsReceivedToThisUser.length) {
    toMemberName = toMember.fullName;
    await bot.sendMessage(
      chatId,
      `${toMemberName} was not the one who sent you the message.\nBut you can send a crush request to ${toMemberName} to see if ${toMemberName} responds!`
    );
    requestsReceivedToThisUser.forEach((r) => {
      bot.sendMessage(
        r.fromId,
        `Hi, ${r.toUserName} tried selecting someone, but unfortunately that wasn't you.`
      );
    });
  }

  console.log({ toMember });

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
      prompt: `${extraMsg}\nDo you want to confirm this anonymous request to ${toMember.fullName}?`,
      buttons: confirmButtons,
      condition: (val) => confirmButtons.includes(val),
      formatter: (val) => val === confirmButtons[0],
    },
    chatId,
    bot
  );
  if (confirmSendMessage) {
    try {
      bot.sendMessage(
        toMember.userId,
        `Hi, this is to let you know that you are having a crush!\nHere's the extra information added by your crush: ${extraMsg}\nEnter /start to search for the list and find the one person you think could be a match on Valentin'e day. If the name matches, both of you will be notified. Else, nothing!`
      );
      bot.sendMessage(chatId, `Message has been sent to ${toMember.fullName}`);
      const newRequest = new Request({
        fromId: msg.from.id,
        toId: selectedUserId,
        matched: false,
        fromUserName: currUserName,
        toUserName: toMember.fullName,
      });
      console.log(newRequest);

      const savedRequest = await newRequest.save();
      console.log(savedRequest);
    } catch (err) {
      bot.sendMessage(chatId, "There's been some error. Please try again");
      console.log("Error: " + err);
    }
  } else {
    bot.sendMessage(chatId, "Cancelled.\nTry /start to try again.");
  }
};
module.exports = sendController;
