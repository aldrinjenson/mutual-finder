const max_requests = 3;
const faqs = [
  {
    q: "What is the purpose of this bot?",
    a: "Many students often have feelings towards another person. Often times however, they are scared to speak up due to the fear of uncertainty and thinking what other's will think of them when they get to know about the happening. This bot is meant to offer a way for one to share thier feelings to their special person through a medium which offers some level of anonymyty but the individual has the full freedom to disclose some level of details for the other person to either fully recognize the person or even to get strong hints.",
  },
  {
    q: "Are my messages private?",
    a: "Yes, the message you send to your crush is never stored anywhere",
  },
  {
    q: "Is ther a maximum limit to the request's I can send?",
    a: `Yes, to avoid spam, all members can send maximum ${max_requests} requests`,
  },
  {
    q: "How long will this bot be available?",
    a: "This bot will be taken down on the evening of February 14th(Valentine's day). So if you've been waiting to confess your feelings to someone, better do it before that:)",
  },
  {
    q: "What data is actually stored in the servers?",
    a: "The bare minimum required. The 6 digit Telegram IDs of both the participants will be stored. This is required to inform both the members once a match has been made. Rest assured, whatever data stored, will be cleared once the bot has been taken down.",
  },
  {
    q: "I updated my profile picture or name, why is it not getting updated in the bot?",
    a: "Due to lack of resources, there may be a delay in the profile pictures getting updated often to 2 hours or more.",
  },
  {
    q: "I never signed up for this/Even though this may be useful for many, I don't want to participate in this. What should I do?",
    a: "This bot was made to give everyone a fair chance. Who knows, without your knowledge, there maybe someone who have immense feelings towards you! However, if you really want to make yourself unavailable, you can try the /togglestatus command to remove yourself from the list of members. This will hide your name from everyone else. A notification will be sent to those who have already sent you any message requests(if any) saying that you've made yourself unavilable.\nNote that if you've already sent requests to anyone else before making yourself unavailable, they won't be able to choose yourself back from the list anymore",
  },
  {
    q: "My crush's name is not present in this list! Why?",
    a: "Probably because your crush hasn't seen this bot before. Only when someone starts using the bot will they be shown in the list. You can send the bot link to any group in which your crush is present so that they will get to know about the bot.",
  },
  {
    q: "Who made this bot?",
    a: "An MEC-ian who faced the problem firsthand and wanted to find a solution. Note that this bot is not associated to any MEC officials or clubs or groups.",
  },
  {
    q: "Should I use this bot and send a message to my crush?",
    a: "Yes.",
  },
  {
    q: "I got a message, but I can't guess who sent it. Can the bot help?",
    a: `In this case the bot can't do anything. However, whoever sent you the message can send another message with a better extra description to give some hints. This is possible only if they haven't already used thier ${max_requests} chances.`,
  },
  {
    q: "What will I lose if I send the message?",
    a: "It depends on how you've written your message. If it's super vague, your crush will probably not recognize you. That way, it'll be the same as the present state, nothing to lose except that your crush would know that there is someone who has feelings towards them. If you put your message the right way, your crush will recognize you and both of you can go celebrate Valentine's day together. So seriously, send that message while the opportnity is available.",
  },
  {
    q: "Anything else I should know about the bot?",
    a: "This bot was made with only good intentions. However like all software, it may not be perfect and would be prone to bugs or misuse by the users. Even though sufficient care has been made to handle edge cases, if the bot stops working correctly in between or if some perople misuses this, the creator of this bot will not be responsible and hence should not be made accountalble.",
  },
];

const splitter = "7.";
const faqString = faqs
  .map(({ q, a }, i) => `${i + 1}. ${q}\nA: ${a}\n`)
  .join("\n")
  .split(splitter);

const faqController = async (bot, msg) => {
  await bot.sendMessage(msg.chat.id, faqString[0]);
  await bot.sendMessage(msg.chat.id, splitter + faqString[1]);
};

module.exports = faqController;
