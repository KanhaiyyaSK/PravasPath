const mongoose = require("mongoose");

let empSchema = new mongoose.Schema({
  agencyId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  mobileNumber: {
    required: true,
    type: String, 
  },
  empType: { 
    required: true,
    type: Number,
  },
  licenseNumber: {
    type: String,
    required: false,
  },
  licensePhoto: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("employee", empSchema);
