const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection
mongoose.connect(
  "mongodb+srv://livhumukona9:koofTNOF1YCAhonX@cluster0.xcbz8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// User schema
const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  favorites: [
    {
      activityId: String,
      activityName: String,
      activityImage: String,
      activityAddress: String,
    },
  ],
});

// User model
const User = mongoose.model("User", userSchema);

// Register route
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error registering user", error });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Error during login", error });
  }
});

app.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = await User.findById(userId).select("username");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ username: user.username });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// Add to favorites route
app.post("/addFavorite", async (req, res) => {
  const { userId, activityId, activityName, activityImage, activityAddress } = req.body;

  if (!userId || !activityId || !activityName || !activityImage || !activityAddress) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFavorite = user.favorites.some((fav) => fav.activityId === activityId);
    if (alreadyFavorite) {
      return res.status(400).json({ message: "Activity already in favorites" });
    }

    user.favorites.push({ activityId, activityName, activityImage, activityAddress });
    await user.save();

    res.status(200).json({ message: "Activity added to favorites", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Error adding to favorites", error });
  }
});


// Get favorites route
app.get("/getFavorites", async (req, res) => {
  const { userId } = req.query; // Expecting userId in query params.

  try {
    const user = await User.findById(userId).select("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if there are favorites, if not, send an empty array
    res.status(200).json(user.favorites || []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorites", error });
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
