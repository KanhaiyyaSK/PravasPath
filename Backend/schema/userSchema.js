const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  agencyId: {
    type: String,
    default: null,
  },
  isValidated: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: "",
  },
  mobile: {
    required: true,
    type: String,
    unique: true,
  },
  phoneOtp: {
    type: String,
  },
  otpExpireTime: {
    type: Number,
  },
  userType: {
    type: String,
    required: true,
    default: "Customer",
  },
  email: {
    type: String,
    required: false,
    default: "",
  },
  dob: {
    type: String,
    required: false,
    default: "",
  },
  gender: {
    type: String,
    required: false,
    default: "",
  },
  //previous schema of myTrips
  // myTrips: [{ type: String, default: [] }],
  
  // schema changed to add the trips of the user
  myTrips: [{
    busName: String,
    boardingLocation: String,
    boardingTime: String,
    droppingLocation: String,
    copassengers: [String],
    seatNumbers: [String]
  }],

  copassenger: [{ type: Object, default: [] }],
});

module.exports = mongoose.model("user", userSchema);

