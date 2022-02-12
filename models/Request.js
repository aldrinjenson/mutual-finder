const mongoose = require("mongoose");
const { Schema } = mongoose;

const RequestSchema = new Schema(
  {
    fromId: {
      unique: true,
      type: Number,
      required: true,
      index: 1,
    },
    toId: {
      unique: true,
      type: Number,
      required: true,
      index: 1,
    },
    fromSearchString: {
      type: String,
      required: false,
    },
    toSearchString: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Request = mongoose.model("Member", RequestSchema);

module.exports = Request;
