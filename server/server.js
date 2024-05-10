const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcryptjs = require("bcryptjs");
const PORT = 5000;
const app = express();
const MONGB_URL = "mongodb://localhost:27017/RegistrationLoginDB";

// Middleware
app.use(cors());
app.use(express.json());
mongoose.connect(MONGB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", (err) => {
  console.error("MongoDB connection error", err);
});
db.once("open", () => {
  console.log("MongoDB is connected");
});

// Schema and Model for User
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z]+$/.test(v);
      },
      message: props => `${props.value} is not a valid first name!`
    }
  },
  lastName: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z]+$/.test(v);
      },
      message: props => `${props.value} is not a valid last name!`
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  country: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
  },
  dob: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        const age = Math.floor((new Date() - new Date(v)) / (1000 * 60 * 60 * 24 * 365));
        return age > 14 && age < 99;
      },
      message: props => `Age must be between 14 and 99 years!`
    }
  }
});

const User = mongoose.model("User", userSchema);

// Route for user registration
app.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error during registration:", error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists!" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});


// Route to get all user data
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
