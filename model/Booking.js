const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  pickup_location: {
    latitude: Number,
    longitude: Number,
    address: String,
  },
  dropoff_location: {
    latitude: Number,
    longitude: Number,
    address: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
