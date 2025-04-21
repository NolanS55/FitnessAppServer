const express = require('express');
const cors = require("cors");
const serviceRoutes = require('./serviceRoutes');

require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Enable JSON parsing
app.use(express.urlencoded({ extended: true })); // Enable form data parsing

app.use('/api/map', serviceRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});