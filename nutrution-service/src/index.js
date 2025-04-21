const express = require('express');
const cors = require("cors");
const nutritionRoutes = require('./nutritionRoutes');
const bodyParser = require('body-parser');

require('dotenv').config();
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Enable JSON parsing
app.use(express.urlencoded({ extended: true })); // Enable form data parsing

app.use('/api/nutrition', nutritionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});