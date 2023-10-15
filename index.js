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

async function getIpLocation( ipAddress) {
    try {
        const apiKey = '18577af5b67323'; // Remplacez par votre clé API IPinfo

        const apiUrl = `https://ipinfo.io/${ipAddress}/json?token=${apiKey}`;

        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            console.log('Emplacement de l\'adresse IP', ipAddress, ':');
            console.log('IP :', data.ip);
            console.log('Ville :', data.city);
            console.log('Région :', data.region);
            console.log('Pays :', data.country);
            console.log('Code postal :', data.postal);
            console.log('Coordonnées géographiques :', data.loc);
            return data;
        } else {
            console.error('La demande a échoué avec le statut', response.status);
            return "Failed to fetch IP info"
        }
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
    }
}

app.get('/', async (req, res) => {
    try {
        // Log the User-Agent String.
        const user_agent = req.headers['user-agent'];

        // Get the current time of request and format time into a readable format.
        const current_time = new Date();
        const timestamp = current_time.toISOString().slice(0, 19).replace('T', ' ');

        // Get the IP address of the requester from x-forwarded-for header
        const get_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Get the user agent
        const userAgent = req.headers['user-agent'];

        console.log("headers: ", req.headers)

        const ipInfo = await getIpLocation(get_ip);
        res.send({ipInfo, userAgent});

    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
    }
});

app.get('/test', (req, res) => {
    res.send("test");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Export the Express API
module.exports = app