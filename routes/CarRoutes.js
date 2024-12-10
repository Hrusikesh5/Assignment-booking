const express = require("express");
const axios = require("axios");
const CarRouter = express.Router();

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
  // distance in km
  return carTypes.map((car) => {
    const randomFactor = Math.random() * 20;

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

    const pickup = { lat: origin.latitude, lon: origin.longitude };
    const dropoff = { lat: destination.latitude, lon: destination.longitude };

    // Call OSRM to get distance
    const url = `https://router.project-osrm.org/route/v1/driving/${pickup.lon},${pickup.lat};${dropoff.lon},${dropoff.lat}?overview=false`;
    const response = await axios.get(url);
    if (
      !response.data ||
      !response.data.routes ||
      response.data.routes.length === 0
    ) {
      return res.status(400).json({ error: "Could not calculate route." });
    }

    const distanceInMeters = response.data.routes[0].distance;
    const distanceInKm = distanceInMeters / 1000;

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
