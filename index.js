// index.js
const express = require('express')

const app = express()
const fs = require('fs');
const request = require('request');
const port = 3000;

const path = require('path');
// chemin absolu du fichier
const spyFilePath = path.join(__dirname, 'spy.gif');
const pixelFilePath = path.join(__dirname, 'pixel.png');
const spy_pixel_logsFilePath = path.join(__dirname, 'spy_pixel_logs.txt');

const simpleGit = require('simple-git')();

async function gitCommitAndPush() {
    try {
        // Ajoute tous les fichiers modifiés et non suivis (équivalent à 'git add .')
        await simpleGit.add('.');

        // Effectue un commit avec le message spécifié
        await simpleGit.commit('updating logs');

        // Pousse les modifications vers le référentiel distant
        await simpleGit.push();

        console.log('Changements ajoutés, commit réalisé et poussé avec succès.');
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
    }
}

// Serve a default page. This function is not required. Serving up a spy.gif for the homepage.
/*
app.get('/', (req, res) => {
    //const spyMeme = "./spy.gif";
    //res.sendFile(spyMeme, { root: __dirname });
    res.sendFile(spyFilePath)
});
*/
app.get('/', (req, res) => {
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
            fs.appendFile(spy_pixel_logsFilePath, log_entry, (err) => {
                if (err) {
                    console.error(err);
                }
            });

            console.log("Retrieved data : ", log_entry);

            res.send(log_entry);

            //gitCommitAndPush().then(r => console.log("pushed data into git : ", log_entry));

            // Serve a transparent pixel image when navigating to .../image URL.
            //res.sendFile(pixelFilePath);
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