var apicache = require('apicache');
var express = require("express");
var fs = require('fs');
var request = require("request");
var timeout = require('connect-timeout');
var strava = require('strava-v3');

var tokenStorePath = "/Users/finlaysmith/accesskeys.json";
var accessTokens = {};
fs.readFile(tokenStorePath, 'utf8', function (err, data) {
    accessTokens = JSON.parse(data);
});

var app = express(),
    port = (process.env.PORT || 3001);
var cache = apicache.middleware;

app.get("/auth", function (req, res) {
    res.redirect(strava.oauth.getRequestAccessURL({ scope: "view_private,write" }));
});

app.get("/thanks", function (req, res) {
    strava.oauth.getToken(req.query.code, function (err, payload, limits) {
        if (!err) {
            accessTokens[payload.athlete.id] = payload.access_token;

            fs.writeFile(tokenStorePath, JSON.stringify(accessTokens), function (err) {
                if (err) {
                    console.log(err);
                }
                console.log("New access token saved");
            });
        } else {
            console.log(err);
        }

        res.redirect('/');
    });
});

app.get("/getAthletes", function (req, res) {
    strava.clubs.listMembers({ 'access_token': accessTokens[12160090], id: 175865 }, function (err, payload, limits) {
        if((limits.shortTermUsage >= limits.shortTermLimit) || (limits.longTermUsage >= limits.longTermLimit)) {
            res.status(429).json({ error: 'Strava API rate limits reached!' });
        }
        if (!err) {
            res.json(payload);
        }
        else {
            res.status(500).json(err);
        }
    });
});

app.get("/getStat/:id", cache('10 minutes'), function (req, res) {
    strava.athletes.stats({ 'access_token': accessTokens[req.params.id], id: req.params.id }, function (err, payload, limits) {
        if((limits.shortTermUsage >= limits.shortTermLimit) || (limits.longTermUsage >= limits.longTermLimit)) {
            res.status(429).json({ error: 'Strava API rate limits reached!' });
        }
        if (!err) {
            res.json(payload);
        }
        else {
            res.status(500).json(err);
        }
    });
});

app.use(express.static("build"));
app.use(timeout(120000));

module.exports = app.listen(port, () => {
    console.log("Server running on port - " + port);
});
