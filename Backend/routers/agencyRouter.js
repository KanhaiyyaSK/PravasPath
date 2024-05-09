const express = require("express");
const {
  addAgency,
  getAgencyInfo,
  getBusHistory,
  updateAgency,
} = require("../controller/agencyController");
const { verifyToken } = require("../Middleware/AuthMiddleware");
const Router = express.Router();

Router.route("/add").post(verifyToken, addAgency);
Router.route("/get/:agencyId").get(verifyToken, getAgencyInfo);
Router.route("/getBusHistory/:agencyId").get(verifyToken, getBusHistory);
Router.route("/update/:agencyId").patch(verifyToken, updateAgency);

module.exports = Router;
