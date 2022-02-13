const mongoose = require("mongoose");
const { Member } = require("../models");
const members = require("../members.json");
require("dotenv").config();

const main = () => {
  console.log(members);

  Member.collection.insertMany(members, (err, res) => {
    if (err) {
      console.log("Error in inserting" + err);
    } else {
      console.log("inserted successfully " + res);
      console.log(res);
    }
  });
};

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to db"))
  .then(() => main())
  .catch((err) => console.log("error in connecting to db" + err));
