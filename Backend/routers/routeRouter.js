const express = require("express");
const {
  addRoute,
  getRoute,
  updateRoute,
  getAllRoutes,
  getAllRoutesByAgencyId,
} = require("../controller/routeController");
const { verifyToken } = require("../Middleware/AuthMiddleware");
const Router = express.Router();

Router.route("/addRoute").post(addRoute);
Router.route("/getRoute/:routeId").get(verifyToken, getRoute);
Router.route("/updateRoute/:routeId").patch(verifyToken, updateRoute);
Router.route("/getAllRoutes").get(verifyToken, getAllRoutes);
// Router.route("/getAllRoutes/:agencyId").get(
//   verifyToken,
//   getAllRoutesByAgencyId
// );
Router.route("/getAllRoutes/:agencyId").get(getAllRoutesByAgencyId);

module.exports = Router;
