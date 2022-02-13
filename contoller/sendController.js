const { Request, Member } = require("../models");
const { getAnswer, getAnswerFromButtonGroup } = require("../utils/lib");
const maxStrikes = 4;

const sendController = async (bot, msg) => {
  const chatId = msg.chat.id;
  const selectedUserId = +msg.text.split(" ")[1];

  if (selectedUserId == msg.from.id) {
    bot.sendMessage(chatId, "Seriously dude, Why you sending to yourself?🤦");
    return;
  }
  const requestsSentByThisUser = await Request.find({ fromId: msg.from.id })
    .lean()
    .exec();

  if (requestsSentByThisUser.length === maxStrikes) {
    bot.sendMessage(
      chatId,
      `You've already used all your ${maxStrikes} chances.\n`
    );
    await Member.findOneAndUpdate({ chatId }, { allStrikesOut: true });
    return;
  }
  const requestsReceivedToThisUser = await Request.find({ toId: msg.from.id })
    .lean()
    .exec();

  const selectedUserMatch = requestsReceivedToThisUser.find(
    (m) => m.fromId === selectedUserId
  );
  const currUserName =
    msg.from.first_name ||
    "" + msg.from.last_name + "" ||
    "@" + msg.from.username;

  if (selectedUserMatch) {
    const { fromUserName, fromId: matchedUserId } = selectedUserMatch;
    const name = fromUserName;

    bot.sendMessage(
      chatId,
      `Congragulations, You've got a match!\nBoth you and ${name} can spend Valentine's day together❤️\nNotification sent to ${name} informing the match!💌`
    );
    bot.sendMessage(
      matchedUserId,
      `Congragulations, ${
        msg.from.username ? "@" + msg.from.username : currUserName
      } has found a match with you!\nNow go call them up and spend Valentine's day together!💯`
    );
    selectedUserMatch.matched = true;
    Request.findByIdAndUpdate(selectedUserMatch._id, { matched: true })
      .then(() => console.log("request status updated"))
      .catch((err) => console.log("Error in updating request status: " + err));
    return;
  }

  const toMember = await Member.findOne({ userId: selectedUserId }).exec();

  if (requestsReceivedToThisUser.length) {
    toMemberName = toMember.fullName;
    await bot.sendMessage(
      chatId,
      `${toMemberName} was not the one who sent you the message.\nBut you can send an anonymous message to ${toMemberName} to see if ${toMemberName} have some feelings towards you!`
    );
    requestsReceivedToThisUser
      .filter((r) => !r.matched)
      .forEach((r) => {
        bot.sendMessage(
          r.fromId,
          `Hi, ${r.toUserName} tried selecting someone, but unfortunately that wasn't you.`
        );
      });
  }

  const { extraMsg } = await getAnswer(
    {
      key: "extraMsg",
      prompt: `Enter the special message you want to send to ${toMember.fullName}. eg: "I'm your classmate and we used to go together by College Bus. I don't talk very much, but I really like you!"`,
      // formatter: (val) => (val === "." ? null : val),
    },
    chatId,
    bot
  );
  console.log(extraMsg);

  const confirmButtons = ["Yes, Nothing to lose🤞", "No, I'm good with myself"];
  const crushMsg = `Hi, this is to let you know that someone from MEC have feelings towards you. Here is the anonymous message sent by that special person to you:\n---\n${extraMsg}\n---\n\nHave some idea who this is from? Enter /start to check or try /faq or /help to know more details about this bot.`;
  const confirmSendMessage = await getAnswerFromButtonGroup(
    {
      key: "confirmSendMessage",
      prompt: `The following message will be sent to ${toMember.fullName}:\n${crushMsg}\n\n\n-------\nDo you want to confirm this?`,
      buttons: confirmButtons,
      condition: (val) => confirmButtons.includes(val),
      formatter: (val) => val === confirmButtons[0],
    },
    chatId,
    bot
  );

  if (confirmSendMessage) {
    try {
      bot
        .sendMessage(selectedUserId, crushMsg)
        .then((r) => console.log("Message sent successfully"));
      bot.sendMessage(chatId, `Message has been sent to ${toMember.fullName}`);
      const newRequest = new Request({
        fromId: msg.chat.id,
        toId: selectedUserId,
        matched: false,
        fromUserName: currUserName,
        toUserName: toMember.fullName,
      });

      await newRequest.save();
      // console.log(savedRequest);
    } catch (err) {
      bot.sendMessage(chatId, "There's been some error. Please try again");
      console.log("Error: " + err);
    }
  } else {
    bot.sendMessage(
      chatId,
      "Cancelled sending message.\nEnter /start to try again."
    );
  }
};
module.exports = sendController;
