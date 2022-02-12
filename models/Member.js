const mongoose = require("mongoose");
const { Schema } = mongoose;

const MemberSchema = new Schema(
  {
    userName: {
      type: String,
      required: false,
    },
    userId: {
      unique: true,
      type: Number,
      required: true,
      index: 1,
    },
    fullName: {
      type: String,
      required: false,
    },
    fullName: {
      type: String,
      required: false,
    },
    photoExists: {
      type: Boolean,
      required: true,
    },
    imgPath: {
      type: String,
      required: false,
    },
    searchString: {
      type: String,
      required: false,
    },
    strikesUsed: {
      type: Number,
      required: true,
      default: 0,
    },
    available: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  { timestamps: true }
);

const Member = mongoose.model("Member", MemberSchema);

module.exports = Member;
