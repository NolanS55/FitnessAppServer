const express = require('express');
const router = express.Router();
const axios = require('axios');

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// Create a new user
router.post('/getRoute', async (req, res) => {
  try {
    const { coords } = req.body;
    console.log('Received coordinates:', process.env.OPENROUTESERVICE_API_KEY);

    const response = await axios.post(
      'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
      {
        coordinates: coords
      },
      {
        headers: {
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
          'Authorization':  process.env.OPENROUTESERVICE_API_KEY,
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    );

    // Send back the response from OpenRouteService API
    // Extracting the instructions and geometry coordinates
    const instructions = [];
    const coordinates = [];

    // Loop through features and extract data
    response.data.features.forEach(feature => {
      feature.properties.segments.forEach(segment => {
        segment.steps.forEach(step => {
            instructions.push(step.instruction);
        });
      });

    // Extracting geometry coordinates
      feature.geometry.coordinates.forEach(coord => {
          coordinates.push(coord);
      });
    });

    console.log("Instructions:", instructions);
    console.log("Coordinates:", coordinates);

    returnData = {
      instructions: instructions,
      coordinates: coordinates
    };

    res.status(response.status).json(returnData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching route' });
  }
});

// Export the router
module.exports = router;