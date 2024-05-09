const mongoose = require("mongoose");

let agencySchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  agencyName: {
    required: true,
    type: String,
    unique: true,
  },
  allBusList: [{ type: String, default: [] }],
  activeBusList: [{ type: String, default: [] }],
  routeList:[{ type: String, default: [] }],
  operatorList: [{ type: String }],

  busHistory: [{ type: String, default: [] }],
  registeredBuses: [{ type: String, default: [] }],
});

module.exports = mongoose.model("agency", agencySchema);
