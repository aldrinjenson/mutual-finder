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
    q: "I updated my profile picture, why is it not getting updated in the bot?",
    a: "Due to lack of resources, there may be a delay in the profile pictures getting updated often to 2 hours or more.",
  },
  {
    q: "I never signed up for this/Even though this may be useful for many, I don't want to participate in this. What should I do?",
    a: "This bot was made to give everyone a fair chance. Who knows, without your knowledge, there maybe someone who have immense feelings towards you. However, if you really want to make yourself unavailable, you can try the /removeme command to remove yourself from the list of members. This will hide your name from everyone else. A notification will be sent to those who have already sent you any message requests(if any) saying that you've made yourself unavilable.\nNote that if you've already sent requests to anyone else before making yourself unavailable, they won't be able to choose yourself back as well",
  },
  {
    q: "Should I use this bot and send a message to my crush?",
    a: "Yes.",
  },
  {
    q: "What will I lose if I send the message?",
    a: "It depends on how you've written your message. If it's super vague, your crush will probably not recognize you. That way, it'll be the same as the present state, nothing to lose except that your crush would know that there is someone who has feelings towards them. If you put your message the right way, your crush will recognize you and both of you can go celebrate Valentine's day together. So seriously dude, send that message while the opportnity is available.",
  },
];

const faqString = faqs
  .map(({ q, a }, i) => `${i + 1}. ${q}\nA: ${a}\n`)
  .join("\n");

const faqController = async (bot, msg) => {
  bot.sendMessage(msg.chat.id, faqString);
};

module.exports = faqController;
