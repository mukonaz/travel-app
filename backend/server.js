// server.js
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");


const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection
mongoose.connect('mongodb+srv://livhumukona9:koofTNOF1YCAhonX@cluster0.xcbz8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

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
const User = mongoose.model('User', userSchema);

// Register route
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error registering user" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, "fbed3a4a6f7ac3d26e0b45338043e2b8176240ed29e9f5b6604d39d8b14b200fb9722363c7b02b4e0702c5910d7f4652d0665d7521fbdf9ad28faa5cfe02fb1b", { expiresIn: "1h" });
  res.json({ token });
});

// Protected route (example)
app.get("/profile", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, "fbed3a4a6f7ac3d26e0b45338043e2b8176240ed29e9f5b6604d39d8b14b200fb9722363c7b02b4e0702c5910d7f4652d0665d7521fbdf9ad28faa5cfe02fb1b", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    User.findById(decoded.userId, (err, user) => {
      if (err) return res.status(500).json({ message: "Error fetching user" });
      res.json({ user });
    });
  });
});

app.post("/addFavorite", async (req, res) => {
    const { userId, activityId, activityName, activityImage, activityAddress } = req.body;
    
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the activity is already in favorites
      const alreadyFavorite = user.favorites.some(fav => fav.activityId === activityId);
      if (alreadyFavorite) {
        return res.status(400).json({ message: "Activity already in favorites" });
      }
  
      // Add activity to user's favorites
      user.favorites.push({ activityId, activityName, activityImage, activityAddress });
      await user.save();
  
      res.status(200).json({ message: "Activity added to favorites" });
    } catch (error) {
      res.status(500).json({ message: "Error adding to favorites", error });
    }
  });
  
  // Add route to fetch the user's favorites
  app.get("/getFavorites", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
  
    jwt.verify(token, "fbed3a4a6f7ac3d26e0b45338043e2b8176240ed29e9f5b6604d39d8b14b200fb9722363c7b02b4e0702c5910d7f4652d0665d7521fbdf9ad28faa5cfe02fb1b", async (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid token" });
  
      try {
        const user = await User.findById(decoded.userId);
        res.json(user.favorites);
      } catch (error) {
        res.status(500).json({ message: "Error fetching favorites", error });
      }
    });
  });

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
