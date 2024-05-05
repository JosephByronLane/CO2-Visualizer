const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS for all routes and origins
const corsOptions = {
    origin: '*'
  };
app.use(cors(corsOptions));
app.use(express.json());

app.post('/api/save-data/:topic', (req, res) => {
    const topic = req.params.topic;
    const data = req.body;

    // Append a timestamp to the incoming data
    const timestamp = new Date();
    const dataWithTimestamp = { ...data, timestamp: timestamp.toISOString() };

    const filePath = `data_${topic}.json`;

    fs.readFile(filePath, (err, fileData) => {
        let jsonData = [];
        if (!err && fileData.length > 0) {
            jsonData = JSON.parse(fileData.toString());
        }
        
        // Append the data with timestamp
        jsonData.push(dataWithTimestamp);

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error writing to file');
                return;
            }
            res.json({ message: 'Data saved successfully' });
        });
    });
});

app.get('/api/data/:topic', (req, res) => {
    const topic = req.params.topic;
    const filePath = `data_${topic}.json`;
    console.log("fetching ", topic)
    console.log("file path ", filePath)

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(404).send('Data not found');
            return;
        }
        res.json(JSON.parse(data.toString()));
    });
});


app.listen(3000, '0.0.0.0', () => {
    console.log(`Server running on port 3000`);
});