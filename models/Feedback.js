const mongoose = require("mongoose");
const { Schema } = mongoose;

const FeedbackSchema = new Schema(
  {
    feedbackMsg: {
      type: String,
      required: true,
    },
    fromUserName: {
      type: String,
      required: true,
    },
    fromUserChatId: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", FeedbackSchema);

module.exports = Feedback;
