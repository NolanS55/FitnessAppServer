const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Create a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, personal } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      password: hashedPassword, // Store hashed password
      name,
      personal
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    console.log("Login Request Received!");
    console.log("Request Body:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ message: "Missing email or password" });
    }

    console.log("Searching for user with email:", email);

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("User found:", user.email);

    // Compare input password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid password");
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    res.json({ message: "Login successful", user });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a user's profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user by email
router.put('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const updatedUser = req.body;
        
        const user = await User.findOneAndUpdate(
            { email },
            { $set: updatedUser },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});


// Update user details (e.g., personal data)
router.put('/:userId', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add daily meal data
router.post('/:userId/daily', async (req, res) => {
  try {
    const { date, meals } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.daily.push({ date, meals });
    await user.save();
    res.status(201).json({ message: 'Daily data added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add daily exercise data
router.post('/:userId/dailyEx', async (req, res) => {
  try {
    const { dateTime, calsBurned, type, time, distance, route } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.dailyEx.push({ dateTime, calsBurned, type, time, distance, route });
    await user.save();
    res.status(201).json({ message: 'Exercise data added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user’s calorie history
router.get('/:userId/calHistory', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.calHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user’s exercise history
router.get('/:userId/exHistory', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.exHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;