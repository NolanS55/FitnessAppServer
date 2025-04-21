const express = require('express');
const router = express.Router();
const axios = require('axios');

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });


// Body parser middleware to parse JSON request bodies


// FatSecret API credentials
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const TOKEN_URL = process.env.TOKEN_URL;
let accessToken = null;

// Helper function to fetch access token
async function fetchAccessToken() {
  try {
    const response = await axios.post(TOKEN_URL, new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'premier barcode', // You can change "barcode" to "basic" depending on your needs
    }), {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    throw new Error(`Failed to fetch access token: ${error.response ? error.response.data : error.message}`);
  }
}

// Function to get the access token
async function getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else {
      return await fetchAccessToken();
    }
  }

// Create a new user
router.post('/getBarcode', async (req, res) => {
    const { barcode } = req.body; // Get barcode from request body

    if (!barcode) {
      return res.status(400).json({ error: 'Barcode is required' });
    }
  
    try {
      // Get access token
      const token = await getAccessToken();
  
      // Make the API request to FatSecret
      const response = await axios.get('https://platform.fatsecret.com/rest/server.api', {
        params: {
          method: 'food.find_id_for_barcode',
          barcode: barcode,
          format: 'json',
          region: 'us', // Explicitly set region to US
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('API Response:', response.data); // Log the API response for debugging
      // Extract the food ID from the response
      const foodId = response.data.food_id.value;
      
      if (foodId) {
        const response = await axios.get('https://platform.fatsecret.com/rest/server.api', {
            params: {
              method: 'food.get.v4',
              food_id: foodId,
              format: 'json',
              region: 'us', // Explicitly set region to US
            },
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

        return res.status(200).json({ foodInfo : response.data.food.servings.serving[0] });
      } else {
        return res.status(404).json({ error: 'Food ID not found' });
      }
    } catch (error) {
      console.error('Error fetching food ID:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Export the router
module.exports = router;