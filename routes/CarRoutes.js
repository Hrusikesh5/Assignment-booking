const express = require("express");
const axios = require("axios");
const CarRouter = express.Router();
const turf = require("@turf/turf");

// Mock car types and base prices
const carTypes = [
  { name: "STANDARD SEDAN", basePrice: 100 },
  { name: "PREMIUM SEDAN", basePrice: 120 },
  { name: "ECONOMY VAN", basePrice: 150 },
  { name: "PREMIUM VAN", basePrice: 180 },
  { name: "LUXURY SEDAN", basePrice: 200 },
];

function convertCurrency(amount, currency) {
  return amount;
}

// Generate car options with prices
function generateCarOptions(distance, currency) {
  // distance is in kilometers
  return carTypes.map((car) => {
    const randomFactor = Math.random() * 20; // Add a bit of randomness
    const price = (car.basePrice + randomFactor) * (distance / 10);
    const convertedPrice = convertCurrency(price, currency);
    return {
      name: car.name,
      price: `${convertedPrice.toFixed(2)} ${currency}`,
    };
  });
}

// API 1: POST /api/getOptions
CarRouter.post("/getOptions", async (req, res) => {
  try {
    const { origin, destination, paxCount, currency, date } = req.body;
    // Validate inputs
    if (!origin || !destination || !currency) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Create Turf points
    const from = turf.point([origin.longitude, origin.latitude]);
    const to = turf.point([destination.longitude, destination.latitude]);

    // Calculate the great-circle distance in kilometers
    const options = { units: "kilometers" };
    const distanceInKm = turf.distance(from, to, options);

    const cars = generateCarOptions(distanceInKm, currency);

    res.json({
      origin,
      destination,
      paxCount,
      currency,
      date,
      distanceKm: distanceInKm.toFixed(2),
      carOptions: cars,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = CarRouter;
