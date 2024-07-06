const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/getClip', async (req, res) => {
    const clipId = req.body.clipId;
    console.log('Clip ID:', clipId);  // Debugging line

    try {
        const response = await axios.get(`https://api.twitch.tv/helix/clips?id=${clipId}`, {
            headers: {
                'Client-ID': 'gzt19qmwz2hv19fnl2ombsn8spzkmr', 
                'Authorization': 'Bearer vwi5l1cf6uv3ecrvk4u1ui3084kx16' 
            }
        });
        console.log('API Response:', response.data);  // Debugging line
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching clip data:', error);
        res.status(500).json({ error: 'Failed to fetch clip data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
