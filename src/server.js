const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const mqtt = require('mqtt');
const port = 3000;

// Enable CORS for all routes and origins
const corsOptions = {
    origin: '*'
  };
app.use(cors(corsOptions));
app.use(express.json());

const client = mqtt.connect('mqtt://3.138.100.11');  // Replace 'your_broker_address' with your MQTT broker's address


client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('equipo-1'); 
    client.subscribe('equipo-2'); 
    client.subscribe('equipo-3'); 
    client.subscribe('equipo-4'); 
    client.subscribe('equipo-5'); 
    client.subscribe('equipo-6'); 
});

client.on('message', (topic, message) => {
    console.log(`Received message from ${topic}`);
    saveMessage(topic, message);
});


function saveMessage(topic, message) {
    console.log("---------------------");
    console.log("saveMessageFunction");

    const filePath = `data_${topic}.json`;
    console.log("File path:", filePath);

    const messageObject = JSON.parse(message.toString());
    console.log("messageObject:", messageObject);

    const dataWithTimestamp = { ...messageObject, timestamp: new Date().toISOString() };

    fs.readFile(filePath, (err, fileData) => {
        let jsonData = [];
        if (err) {
            if (err.code === 'ENOENT') {
                console.log("File does not exist, initializing new file.");
                jsonData = [];
            } else {
                console.error("Error reading file:", err);
                return;
            }
        } else {
            try {
                if (fileData.length > 0) {
                    jsonData = JSON.parse(fileData.toString());
                }
            } catch (parseErr) {
                console.error("Error parsing JSON from file:", parseErr);
                jsonData = [];
            }
        }

        jsonData.push(dataWithTimestamp);

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('Data saved successfully');
            }
        });
    });
}



app.post('/api/save-data/:topic', (req, res) => {
    const topic = req.params.topic;
    const data = req.body;
    console.log("---------------------")
    console.log("POST")

    console.log("topic:", topic)
    console.log("data:", data)

    const timestamp = new Date();
    const dataWithTimestamp = { ...data, timestamp: timestamp.toISOString() };

    const filePath = `data_${topic}.json`;
    console.log("filePath:", filePath)

    fs.readFile(filePath, (err, fileData) => {
        let jsonData = [];
        if (!err && fileData.length > 0) {
            jsonData = JSON.parse(fileData.toString());
        }
        
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
    console.log("---------------------")
    console.log("GET")
    const topic = req.params.topic;
    const filePath = `data_${topic}.json`;
    console.log("topic ", topic)
    console.log("filePath ", filePath)

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