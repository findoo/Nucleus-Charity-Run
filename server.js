const apicache = require('apicache');
const express = require('express');
const fs = require('fs');
const strava = require('strava-v3');
const timeout = require('connect-timeout');
const winston = require('winston');

const tokenStorePath = './accesskeys.json';
let accessTokens = {};
fs.readFile(tokenStorePath, 'utf8', (err, data) => {
    accessTokens = JSON.parse(data);
});

const app = express(),
    port = (process.env.PORT || 3001);
const cache = apicache.middleware;

function checkLimits(limits, res) {
    if (limits !== null && (limits.shortTermUsage >= limits.shortTermLimit || limits.longTermUsage >= limits.longTermLimit)) {
        res.status(429).json({ error: 'Strava API rate limits reached!' });
        return false;
    }
    return true;
}

function checkError(err, res) {
    if (err) {
        res.status(500).json(err);
        return false;
    }
    return true;
}

app.get('/auth', (req, res) => {
    res.redirect(strava.oauth.getRequestAccessURL({ scope: 'view_private,write' }));
});

app.get('/thanks', (req, res) => {
    strava.oauth.getToken(req.query.code, (err, payload, limits) => {
        if (checkLimits(limits, res) && checkError(err, res)) {
            accessTokens[payload.athlete.id] = payload.access_token;
            fs.writeFile(tokenStorePath, JSON.stringify(accessTokens), (writeErr) => {
                if (writeErr) {
                    winston.log('error', 'Problem saving auth key!', err);
                }
                winston.log('info', 'New access token saved');
            });
            apicache.clear();
            res.redirect('/');
        }
    });
});

app.get('/getAthletes', (req, res) => {
    const athletePromises = Object.keys(accessTokens)
        .map(key => new Promise((resolve, reject) => {
            strava.athlete.get({ 'access_token': accessTokens[key] }, (err, payload) => {
                if (err) {
                    reject();
                }
                resolve({
                    id: key,
                    firstname: payload.firstname,
                    lastname: payload.lastname
                });
            });
        }));

    Promise.all(athletePromises).then((results => res.json(results)));
});

app.get('/getStat/:id', cache('10 minutes'), (req, res) => {
    strava.athletes.stats({ 'access_token': accessTokens[req.params.id], id: req.params.id }, (err, payload, limits) => {
        if (checkLimits(limits, res) && checkError(err, res)) {
            res.json(payload);
        }
    });
});

app.use(express.static('build'));
app.use(timeout(120000));

module.exports = app.listen(port, () => {
    winston.log('info', 'Server running on port - ' + port);
});
