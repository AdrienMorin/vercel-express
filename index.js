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
        } else {
            console.error('La demande a échoué avec le statut', response.status);
        }
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
app.get('/', async (req, res) => {
    // Log the User-Agent String.
    const user_agent = req.headers['user-agent'];

    // Get the current time of request and format time into a readable format.
    const current_time = new Date();
    const timestamp = current_time.toISOString().slice(0, 19).replace('T', ' ');

    // Log the IP address of the requester.
    const get_ip = req.ip;

    console.log("ip: ", get_ip);

    // Lookup Geolocation of IP Address.
    try {
        const apiKey = '18577af5b67323'; // Remplacez par votre clé API IPinfo

        const apiUrl = `https://ipinfo.io/${get_ip}/json?token=${apiKey}`;

        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            console.log('Emplacement de l\'adresse IP', get_ip, ':');
            console.log('IP :', data.ip);
            console.log('Ville :', data.city);
            console.log('Région :', data.region);
            console.log('Pays :', data.country);
            console.log('Code postal :', data.postal);
            console.log('Coordonnées géographiques :', data.loc);
            res.send(data);
        } else {
            console.error('La demande a échoué avec le statut', response.status);
        }
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Export the Express API
module.exports = app