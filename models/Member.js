const mongoose = require("mongoose");
const { Schema } = mongoose;

const MemberSchema = new Schema(
  {
    username: {
      type: String,
      required: false,
    },
    chatId: {
      unique: true,
      type: Number,
      required: true,
      index: 1,
    },
    fullName: {
      type: String,
      required: false,
    },
    photoExists: {
      type: Boolean,
      required: true,
    },
    imgUrl: {
      type: String,
      required: false,
    },
    searchString: {
      type: String,
      required: false,
    },
    available: {
      type: Boolean,
      required: false,
      default: true,
    },
    userId: {
      type: String,
      required: true,
    },
    allStrikesOut: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Member = mongoose.model("Member", MemberSchema);

module.exports = Member;
