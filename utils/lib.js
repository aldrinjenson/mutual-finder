const handleMsgDelete = ({ message }, bot) => {
  const { chat, message_id } = message;
  bot.deleteMessage(chat.id, message_id);
};

String.prototype.hashCode = function () {
  if (!this) {
    return "";
  }
  var hash = 0,
    i,
    chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// const messageReplyPairs = {};
const callBackKeys = {};
const promptAnswersObj = {};

const initializeLibFunctions = (bot) => {
  // for handling inline button presses
  bot.on("callback_query", (callbackQuery) => {
    const { id: queryId, data: selectedVal } = callbackQuery;
    bot.answerCallbackQuery(queryId); // necessary to prevent the loading/clock symbol on inline buttons. Thanks @Abhishek :)
    const func = callBackKeys[selectedVal];
    if (func) {
      func(callbackQuery, bot);
    }
  });

  // for handling bot answers -> #getAnswer
  bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    if (msg.text && msg.text[0] === "/") {
      return;
    } else if (promptAnswersObj[chatId]?.cb) {
      promptAnswersObj[chatId].cb(msg);
    }
  });
};

const answers = {};
const getAnswer = async (promptsList, chatId, bot) => {
  answers[chatId] = {
    // to ensure that the values are unique for each user
    prompts: Array.isArray(promptsList) ? promptsList : [promptsList],
    values: {},
  };

  return new Promise((resolve) => {
    // will be called by bot for each answer received
    const cb = async (msg) => {
      const chatId = msg.chat.id;
      let val = msg.text || msg.location;
      const currentPrompt = answers[chatId].prompts[0];
      if (currentPrompt.condition && !currentPrompt.condition(val)) {
        await bot.sendMessage(
          chatId,
          currentPrompt.errorMsg || "Invalid entry. Please verify and try again"
        );
        return handleFlow(answers[chatId].prompts, chatId);
      } else {
        const { key, formatter } = currentPrompt;
        if (formatter) {
          val = formatter(val);
        }
        answers[chatId].values[key] = val;
        answers[chatId].prompts.shift(); // removing the first question after the user has given the answer to it
        handleFlow(answers[chatId].prompts, chatId);
      }
    };

    const handleFlow = (prompts, chatId) => {
      if (!prompts.length) {
        const chatAnswer = answers[chatId].values;
        delete answers[chatId];
        delete promptAnswersObj[chatId];
        return resolve(chatAnswer); // when finished asking all the prompts from list
      }

      const currPrompt = answers[chatId].prompts[0];
      bot.sendMessage(chatId, currPrompt.prompt, currPrompt.keyboard);
    };
    handleFlow(answers[chatId].prompts, chatId);
    promptAnswersObj[chatId] = {};
    promptAnswersObj[chatId].cb = cb; // setting cb to be called for each answer
  });
};

const buttonAnswers = {};
const getAnswerFromButtonGroup = (prompt, chatId, bot) => {
  buttonAnswers[chatId] = {
    prompt,
    value: {},
  };

  return new Promise((resolve) => {
    const cb = (cbQuery, bot, val) => {
      const chatId = cbQuery.message.chat.id;
      const currPrompt = buttonAnswers[chatId].prompt;
      if (currPrompt.formatter) {
        resolve(currPrompt.formatter(val));
      }
      resolve(val);
      handleMsgDelete(cbQuery, bot);
    };
    const buttons = prompt.buttons.map((val) => ({
      text: val,
      onPress: (cbQuery, bot) => cb(cbQuery, bot, val),
    }));
    const keyboardOptions = handleButtons(buttons, chatId.toString());
    bot.sendMessage(chatId, prompt.prompt, keyboardOptions);
  });
};

// takes buttons and returns markup for regular popup keyboard
const getPopupKeyboard = (buttons) => {
  const rows = [];
  let newRow = [];
  for (let i = 0; i < buttons.length; i++) {
    newRow.push(buttons[i]);
    if (i % 2 !== 0 || i === buttons.length - 1) {
      rows.push(newRow);
      newRow = [];
    }
  }
  return {
    reply_markup: {
      keyboard: rows,
      one_time_keyboard: true,
    },
  };
};

// wrapper to make inline keyboards with callback easy
const handleButtons = (rows, uid = "") => {
  if (!rows) {
    return null;
  }

  const markupRows = [];
  let newRow = [];

  for (let i = 0; i < rows.length; i++) {
    const key = rows[i].text + uid.hashCode();
    callBackKeys[key] = rows[i].onPress;

    const keyBoardRow = { text: rows[i].text, callback_data: key };
    newRow.push(keyBoardRow);

    if (i % 2 !== 0 || i === rows.length - 1) {
      markupRows.push(newRow);
      newRow = [];
    }
  }

  return {
    reply_markup: {
      inline_keyboard: markupRows,
    },
    parse_mode: "HTML",
  };
};

module.exports = {
  handleButtons,
  getAnswerFromButtonGroup,
  getPopupKeyboard,
  initializeLibFunctions,
  getAnswer,
};
