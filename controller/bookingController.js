const Booking = require("../model/Booking");
const User = require("../model/User");
const axios = require("axios");

const generateCarOptions = () => {
  const cars = [
    { name: "Maruti Alto", price: Math.round(Math.random() * 100 + 100) },
    { name: "Hyundai Xcent", price: Math.round(Math.random() * 100 + 100) },
    { name: "Toyota Innova", price: Math.round(Math.random() * 100 + 100) },
    { name: "Honda City", price: Math.round(Math.random() * 100 + 100) },
    { name: "Ford Figo", price: Math.round(Math.random() * 100 + 100) },
  ];

  return cars.map((car) => ({
    name: car.name,
    price: `${car.price}.00`,
  }));
};

exports.addBooking = async (req, res) => {
  const { pickup_location, dropoff_location, userName } = req.body;
  console.log(pickup_location, dropoff_location, userName);

  let user = await User.findOne({ name: userName });
  if (!user) {
    user = new User({ name: userName });
    await user.save();
  }

  try {
    const booking = new Booking({
      pickup_location,
      dropoff_location,
      user: user._id,
    });
    await booking.save();

    res.status(201).json({
      message: "Booking successfully created",
      booking: booking.toObject(),
    });
  } catch (error) {
    console.error("Booking creation failed:", error);
    res
      .status(500)
      .json({ message: "Failed to create booking", error: error.message });
  }
};

exports.getCarOptions = async (req, res) => {
  console.log(req.body);
  const { pickup_location, dropoff_location } = req.body;
  if (!pickup_location || !dropoff_location) {
    return res
      .status(400)
      .json({ message: "Pickup and dropoff locations are required." });
  }
  try {
    const response = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${pickup_location.longitude},${pickup_location.latitude};${dropoff_location.longitude},${dropoff_location.latitude}?overview=false`
    );
    const distance = response.data.routes[0].distance / 1000;

    const cars = generateCarOptions();
    res.json({
      message: "Car options and distance fetched successfully",
      options: {
        distance: distance.toFixed(2) + " km",
        cars,
      },
    });
  } catch (error) {
    console.error("Failed to fetch car options:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch car options", error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "name");
    res.json(bookings);
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    res
      .status(500)
      .json({ message: "Failed to get bookings", error: error.message });
  }
};
