const express = require("express");
const {
  signUp,
  updateUser,
  deleteUser,
  getUser,
  verifyOtp,
  addCopassenger,
  addTrip
} = require("../controller/userController");
const { verifyToken } = require("../Middleware/AuthMiddleware");
const Router = express.Router();

Router.route("/signup").post(signUp);
Router.route("/verifyOtp").get(verifyOtp);
Router.route("/:mobile").get(verifyToken, getUser);
Router.route("/update/:id").patch(verifyToken, updateUser);
Router.route("/delete/:id").delete(verifyToken, deleteUser);
Router.route("/addCopassenger/:id").post(verifyToken, addCopassenger);
Router.post("/addTrip", addTrip);

//changepwd, updateprofile, getuserdata

module.exports = Router;