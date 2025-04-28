const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5050;

app.use(cors());
app.use(express.json());

// Your OpenWeatherMap API key
const API_KEY = "1443433f68d06a34eb0d0f3db2d1c7fb";

// Weather endpoint
app.get('/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);

    const temp = response.data.main.temp;
    const humidity = response.data.main.humidity;
    const condition = response.data.weather[0].main;

    let advice = "";

    if (temp > 35) {
      advice = "🔥 It's too hot. Consider frequent irrigation and mulching.";
    } else if (temp < 10) {
      advice = "❄️ Low temperature. Protect sensitive crops with covers.";
    } else if (humidity > 80) {
      advice = "🌧️ High humidity! Risk of fungal diseases – consider fungicide spraying.";
    } else {
      advice = "✅ Optimal conditions for most crops.";
    }

    res.json({
      temperature: temp,
      humidity: humidity,
      condition: condition,
      advice: advice
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(port, () => {
  console.log(`Weather server running at http://localhost:${port}`);
});
