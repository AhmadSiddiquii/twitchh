const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public')); 
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); // Send the index.html file
});

app.post('/getClip', async (req, res) => {
  const { clipId } = req.body;

  try {
    const response = await axios.get(`https://api.twitch.tv/helix/clips?id=${clipId}`, {
      headers: {
        'Client-ID': process.env.CLIENT_ID,
        'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching clip');
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
