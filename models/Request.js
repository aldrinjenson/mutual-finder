const mongoose = require("mongoose");
const { Schema } = mongoose;

const RequestSchema = new Schema(
  {
    fromId: {
      type: Number,
      required: true,
      index: 1,
    },
    toId: {
      type: Number,
      required: true,
      index: 1,
    },
    fromUserName: {
      type: String,
      required: false,
    },
    toUserName: {
      type: String,
      required: false,
    },
    matched: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", RequestSchema);

module.exports = Request;
