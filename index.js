require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const connectDB = require("./connection/db");

const CarRouter = require("./routes/CarRoutes");
const bookingRouter = require("./routes/BookingRoutes");

// connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// app.use(bodyParser.json());

// app.use('/api/users', require('./routes/userRoutes'));
app.get("/", (req, res) => {
  res.status(200).send("Hello, Developer!");
});
app.use("/api", CarRouter);
app.use("/api", bookingRouter);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
