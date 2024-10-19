const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const FormDataModel = require("./models/FormData");

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS configuration to allow credentials (cookies)
app.use(
  cors({
    origin: "http://localhost:5173", // Updated to match your frontend URL
    credentials: true, // Allow credentials (cookies)
  })
);

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://niranjan:niranjan@practice-mern.2ohmq.mongodb.net/")
  .then(() => {
    console.log("Connected to Database");
  })
  .catch(() => {
    console.log("Error connecting to database");
  });

// Registration endpoint
app.post("/register", async (req, res) => {
  const { name, email, password, userType, age, contact, address } = req.body;

  try {
    const existingUser = await FormDataModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Already registered");
    }

    const newUser = new FormDataModel({
      name,
      email,
      password,
      role: userType,
      age,
      contact,
      address,
    });

    await newUser.save();
    res.status(201).send("Registered successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await FormDataModel.findOne({ email });
  
      if (!user) {
        return res
          .status(404)
          .json({ status: "Error", message: "No records found!" });
      }
  
      if (user.password === password) {
        res.cookie("userId", user._id.toString(), {
          httpOnly: false,
          secure: false,
          maxAge: 3600000,
          sameSite: "Lax",
        });
  
        res.json({ status: "Success", role: user.role, userId: user._id });
      } else {
        res.status(401).json({ status: "Error", message: "Wrong password" });
      }
    } catch (error) {
      res.status(500).send("Error occurred: " + error.message);
    }
  });
  

// Fetch Patient Info by ID
app.get("/patient/:id", async (req, res) => {
  const patientId = req.params.id;
  try {
    const patient = await FormDataModel.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res
        .status(404)
        .json({ status: "Error", message: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
});

app.get("/nurse/:id", async (req, res) => {
    const nurseId = req.params.id;
    try {
      const nurse = await FormDataModel.findById(nurseId);
      if (!nurse || nurse.role !== "nurse") {
        return res
          .status(404)
          .json({ status: "Error", message: "Nurse not found" });
      }
      res.json(nurse);
    } catch (error) {
      res.status(500).json({ status: "Error", message: error.message });
    }
  });

// Start the server
app.listen(3001, () => {
  console.log("Server listening on http://127.0.0.1:3001");
});