const mongoose = require("mongoose");

let routeSchema = new mongoose.Schema({
  routeName: String,
  sourceList: [{ type: Object }],
  destinationList: [{ type: Object }],
  agencyId: {
    type: String,
  },
});

module.exports = mongoose.model("route", routeSchema);
