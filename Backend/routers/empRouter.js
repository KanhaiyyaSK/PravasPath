const express = require("express");
const {
  createEmp,
  getEmp,
  updateEmp,
  deleteEmp,
  getEmpByAgencyId,
} = require("../controller/empController");
const { verifyToken } = require("../Middleware/AuthMiddleware");
const Router = express.Router();

Router.route("/create").post(verifyToken, createEmp);
Router.route("/get/:empId").get(verifyToken, getEmp);
Router.route("/update/:empId").patch(verifyToken, updateEmp);
Router.route("/delete/:empId").delete(verifyToken, deleteEmp);
// Router.route("/getByAgency/:agencyId").get(verifyToken, getEmpByAgencyId);
Router.route("/getByAgency/:agencyId").get( getEmpByAgencyId);

module.exports = Router;
