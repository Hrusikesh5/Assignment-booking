const express = require("express");
const axios = require("axios");
const bookingRouter = express.Router();

// API 2: POST /api/confirmBooking
bookingRouter.post("/confirmBooking", (req, res) => {
  const {
    carType,
    origin,
    destination,
    date,
    currency,
    paxCount,
    passengerDetails,
  } = req.body;

  // Validate
  if (!carType || !origin || !destination || !date || !currency || !paxCount) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Mock a total price (in a real scenario, we would recalculate or retrieve from previous API)
  // For now just a random price
  const totalPrice = (Math.random() * 100 + 200).toFixed(2);

  const bookingConfirmation = {
    message: "Booking confirmed",
    bookingDetails: {
      carType,
      origin,
      destination,
      date,
      currency,
      paxCount,
      passengerDetails,
      totalPrice: `${totalPrice} ${currency}`,
      bookingId: `BK${Date.now()}`,
    },
  };

  res.json(bookingConfirmation);
});

module.exports = bookingRouter;
