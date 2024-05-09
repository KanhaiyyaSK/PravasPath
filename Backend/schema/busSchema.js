const mongoose = require("mongoose");

let busSchema = new mongoose.Schema({
  busId: {
    required: true,
    type: String,
    unique: true,
  },
  busName: { type: String },
  busModel: {
    type: String,
  },
  busType: {
    type: String,
  },
  busRegistrationNumber: {
    type: String,
  },
  busPermitNumber: {
    type: String,
  },
  busInsuranceNumber: {
    type: String,
  },
  busAmenities: [{ type: String }],
  busPhotos: [{ type: String }],
  busSeats: { type: Map},
  agencyId: {
    type: String,
  },
});

module.exports = mongoose.model("bus", busSchema);
