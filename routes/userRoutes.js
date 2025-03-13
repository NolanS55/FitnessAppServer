const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Create a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, personal } = req.body;

    const newUser = new User({
      email,
      password,
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
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
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