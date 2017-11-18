var express = require("express");
var request = require("request");
var timeout = require('connect-timeout');
var strava = require('strava-v3');

var app = express(),
    port = (process.env.PORT || 3001);

app.get("/auth", function (req, res) {
    res.redirect(strava.oauth.getRequestAccessURL({ scope: "view_private,write" }));
});

app.get("/thanks", function (req, res) {
    res.json({ msg: "Thanks!" });
});

app.get("/getAthletes", function (req, res) {
    strava.clubs.listMembers({ id: 175865 }, function (err, payload, limits) {
        if (!err) {
            res.json(payload);
        }
        else {
            res.json(err);
        }
    });
});

app.get("/getStat/:id", function (req, res) {
    strava.athletes.stats({ id: req.params.id }, function (err, payload, limits) {
        if (!err) {
            res.json(payload);
        }
        else {
            res.json(err);
        }
    });
});

app.use(express.static("build"));
app.use(timeout(120000));

module.exports = app.listen(port, () => {
    console.log("Server running on port - " + port);
});