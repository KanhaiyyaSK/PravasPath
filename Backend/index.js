const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const connectDatabase = require("./database/connection");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
const userRouter = require("./routers/userRouter");
const busRouter = require("./routers/busRouter");
const agencyRouter = require("./routers/agencyRouter");
const busScheduleRouter = require("./routers/busScheduleRouter");
const empRouter = require("./routers/empRouter");
const routeRouter = require("./routers/routeRouter");
const searchRouter = require("./routers/searchRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT;

connectDatabase();

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async function () {
  await db.collection("users").createIndex({ mobile: 1 }, { unique: true });
});

app.get("/test", (req, res) => {
  res.status(200).send({
    "status code": res.statusCode,
    message: "Successfully tested!",
  });
});

app.use("/user", userRouter);
app.use("/bus", busRouter);
app.use("/agency", agencyRouter);
app.use("/busSchedule", busScheduleRouter);
app.use("/employee", empRouter);
app.use("/route", routeRouter);
app.use("/search", searchRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});
