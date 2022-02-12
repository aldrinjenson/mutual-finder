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
    allStrikesUsed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Member = mongoose.model("Member", MemberSchema);

module.exports = Member;
