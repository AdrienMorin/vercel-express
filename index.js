// index.js
const express = require('express')

const app = express()
const fs = require('fs');
const request = require('request');
const port = 3000;

const path = require('path');
// chemin absolu du fichier
const spyFilePath = path.join(__dirname, 'spy.gif');

// Serve a default page. This function is not required. Serving up a spy.gif for the homepage.
app.get('/', (req, res) => {
    //const spyMeme = "./spy.gif";
    //res.sendFile(spyMeme, { root: __dirname });
    res.send('Hey this is my API running 🥳')
});

app.get('/test', (req, res) => {
    //const spyMeme = "./spy.gif";
    //res.sendFile(spyMeme, { root: __dirname });
    res.sendFile(spyFilePath)
});

app.get('/image', (req, res) => {
    // File path and name for 1 x 1 pixel. Must be an absolute path to pixel.
    const filename = "./pixel.png";

    // Log the User-Agent String.
    const user_agent = req.headers['user-agent'];

    // Get the current time of request and format time into a readable format.
    const current_time = new Date();
    const timestamp = current_time.toISOString().slice(0, 19).replace('T', ' ');

    // Log the IP address of the requester.
    const get_ip = req.ip;

    // Lookup Geolocation of IP Address.
    const apiUrl = `https://geolocation-db.com/jsonp/${get_ip}`;
    request(apiUrl, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const data = body.split('(')[1].slice(0, -1);
            const log_entry = `Email Opened:\nTimestamp: ${timestamp}\nUser Agent: ${user_agent}\nIP Address: ${data}\n`;

            // Write log to hardcoded path. Must be an absolute path to the log file.
            fs.appendFile('./spy_pixel_logs.txt', log_entry, (err) => {
                if (err) {
                    console.error(err);
                }
            });

            // Serve a transparent pixel image when navigating to .../image URL.
            res.sendFile(filename, { root: __dirname });
        } else {
            console.error(error);
            res.status(500).send('Error retrieving geolocation data');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Export the Express API
module.exports = app