const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const User = require("./models/User");


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(" Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Register route
app.post("/register", async (req, res) => {
  const { fullName, email, phone } = req.body;

  try {
    const user = new User({ fullName, email, phone });
    await user.save();
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Email already registered." });
    } else {
      res.status(500).json({ message: "Something went wrong." });
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

