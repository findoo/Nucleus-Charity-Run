const apicache = require('apicache');
const express = require('express');
const fs = require('fs');
const strava = require('strava-v3');
const timeout = require('connect-timeout');
const winston = require('winston');

const tokenStorePath = '/Users/finlaysmith/accesskeys.json';
let accessTokens = {};
fs.readFile(tokenStorePath, 'utf8', function (err, data) {
    accessTokens = JSON.parse(data);
});

const app = express(),
    port = (process.env.PORT || 3001);
const cache = apicache.middleware;

function checkLimits(limits, res) {
    if (limits !== null && (limits.shortTermUsage >= limits.shortTermLimit || limits.longTermUsage >= limits.longTermLimit)) {
        res.status(429).json({ error: 'Strava API rate limits reached!' });
    }
}

function checkError(err, res) {
    if (err) {
        res.status(500).json(err);
    }
}

app.get('/auth', function (req, res) {
    res.redirect(strava.oauth.getRequestAccessURL({ scope: 'view_private,write' }));
});

app.get('/thanks', function (req, res) {
    strava.oauth.getToken(req.query.code, function (err, payload, limits) {
        checkLimits(limits, res);
        checkError(err, res);

        accessTokens[payload.athlete.id] = payload.access_token;

        fs.writeFile(tokenStorePath, JSON.stringify(accessTokens), function (err) {
            if (err) {
                winston.log('error', 'Problem saving auth key!', err);
            }
            winston.log('info', 'New access token saved');
        });
        apicache.clear();
        res.redirect('/');
    });
});

app.get('/getAthletes', function (req, res) {
    apicache.clear();
    strava.clubs.listMembers({ 'per_page': 200, 'access_token': accessTokens[12160090], id: 175865 }, function (err, payload, limits) {
        checkLimits(limits, res);
        checkError(err, res);

        res.json(payload);
    });
});

app.get('/getStat/:id', cache('10 minutes'), function (req, res) {
    strava.athletes.stats({ 'access_token': accessTokens[req.params.id], id: req.params.id }, function (err, payload, limits) {
        checkLimits(limits, res);
        checkError(err, res);

        res.json(payload);
    });
});

app.use(express.static('build'));
app.use(timeout(120000));

module.exports = app.listen(port, () => {
    winston.log('info', 'Server running on port - ' + port);
});
