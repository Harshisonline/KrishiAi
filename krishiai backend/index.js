const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = 5000;

// Setup multer for file uploads (store in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());

// Dummy upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  console.log('Received file:', req.file.originalname);

  // Dummy logic: based on filename, randomize health status
  const dummyHealthStatuses = ['Healthy', 'Needs Water', 'Diseased', 'Nutrient Deficient'];
  const dummyRecommendations = {
    'Healthy': ['Keep maintaining good care!', 'Monitor regularly.'],
    'Needs Water': ['Increase watering schedule.', 'Use drip irrigation.'],
    'Diseased': ['Apply organic fungicide.', 'Remove infected parts.'],
    'Nutrient Deficient': ['Add nitrogen-rich fertilizer.', 'Use compost.']
  };

  const randomIndex = Math.floor(Math.random() * dummyHealthStatuses.length);
  const selectedHealth = dummyHealthStatuses[randomIndex];
  const recommendations = dummyRecommendations[selectedHealth];

  // Send back a dummy analysis result
  res.json({
    healthStatus: selectedHealth,
    recommendations: recommendations,
    fileName: req.file.originalname
  });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
