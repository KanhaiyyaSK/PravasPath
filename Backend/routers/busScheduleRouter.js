const express = require("express");
const {
  createBusSchedule,
  getBusSchedule,
  updateBusSchedule,
  deleteBusSchedule,
  getBusesWithRouteDate,
} = require("../controller/busScheduleController");
const { verifyToken } = require("../Middleware/AuthMiddleware");
const Router = express.Router();

Router.route("/create").post(verifyToken, createBusSchedule);
Router.route("/get/:busScheduleId").get(verifyToken, getBusSchedule);
Router.route("/getBusesWithRouteDate").get(verifyToken, getBusesWithRouteDate);
Router.route("/update/:busScheduleId").patch(verifyToken, updateBusSchedule);
Router.route("/delete/:busScheduleId").delete(verifyToken, deleteBusSchedule);

module.exports = Router;
