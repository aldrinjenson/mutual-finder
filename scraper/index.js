const express = require("express");
const download = require("download");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");
const app = express();

app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS,GET,POST");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});
app.use(express.json());
app.use(morgan("dev"));
const PORT = process.env.PORT || 6000;

app.get("/download", async (req, res) => {
  console.log(req.query);
  const { url, userId } = req.query;
  fs.writeFile(`photos/${userId}.jpg`, await download(url), (err) => {
    if (!err) {
      console.log("successfully done");
      res.send("Updated");
    } else {
      res.send("error in updaing: " + err);
    }
  });
});

app.get("/test", (req, res) => {
  res.send("working fine");
});

app.listen(PORT, () => console.log("server listening on port: " + PORT));
