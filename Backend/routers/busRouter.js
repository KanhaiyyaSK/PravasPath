const express = require("express");
const {
  updateBus,
  addBus,
  getBus,
  getBusesByAgencyId,
} = require("../controller/busController");
const { verifyToken } = require("../Middleware/AuthMiddleware");
const Router = express.Router();

Router.route("/addBus").post(verifyToken, addBus);
Router.route("/:busId").get(verifyToken, getBus);
Router.route("/updateBus/:busId").patch(verifyToken, updateBus);
// Router.route("/agency/:agencyId").get(verifyToken, getBusesByAgencyId);
Router.route("/agency/:agencyId").get(getBusesByAgencyId);
module.exports = Router;
