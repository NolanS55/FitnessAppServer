const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");
const userRoutes = require('./userRoutes');

require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json()); // Enable JSON parsing
app.use(express.urlencoded({ extended: true })); // Enable form data parsing


// MongoDB Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


