const mongoose = require("mongoose");

let busScheduleSchema = new mongoose.Schema({
  // Selected bus from registered buses
  busId: {
    type: String,
  },

  // Selected route from route list
  routeId: {
    type: String,
  },

  // Fare details (static)
  staticFare: {
    fareForSeater: {
      type: Number,
      default: 0,
    },
    fareForSingleSleeper: {
      type: Number,
      default: 0,
    },
    fareForDoubleSleeper: {
      type: Number,
      default: 0,
    },
  },

  // Selected driver and conductor from employee list => Employee id at 0 will indicate bus driver
  employeeList: [{ type: String, default: [] }],

  // Operating days -> List of dates
  operatingDays: [{ type: String, default: [] }],

  // List of Rest stops and times
  restStops: [
    {
      location: String,
      time: String,
    },
  ],

  // Pdf link of cancellation policy
  cancellationPolicyPDF: {
    type: String,
  },
});

module.exports = mongoose.model("busSchedule", busScheduleSchema);
