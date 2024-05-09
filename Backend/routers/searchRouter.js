const express = require("express");
const { searchBuses } = require("../controller/searchController");
const { verifyToken } = require("../Middleware/AuthMiddleware");
const Router = express.Router();

Router.route("/").get(verifyToken, searchBuses);
module.exports = Router;
