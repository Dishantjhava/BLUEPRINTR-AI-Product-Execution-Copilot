const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Main API endpoint
app.get('/api/status', (req, res) => {
  res.json({ message: 'Frontend and Backend are connected successfully!' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
