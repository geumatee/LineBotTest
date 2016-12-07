/*eslint no-undef: "error"*/
/*eslint-env node*/

var express = require('express');
var router = express.Router();

var request = require('request');

// var app = express();
// var bodyParser = require('body-parser');
// var multer = require('multer'); // v1.0.5
// var upload = multer(); // for parsing multipart/form-data

/* GET users listing. */
router.get('/', function(req, res, next) {
    var headers = {
        'Authorization': 'Bearer r66gB/QeQB9YKgvhT9QZoXmRuf0VIIIfsKiszE6+Qa0P2goun2p1hqBhuJwlTZNA5VOeojEffX95TJB162tqBXNWLxfuQzVlfuThpbzhtPhs9HddCEtj0+GxlJXufpEMAdHAhuu0INpJZxZudiYbYAdB04t89/1O/w1cDnyilFU='
    };

    var options = {
        url: 'https://api.line.me/v1/oauth/verify',
        headers: headers
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
    }

    request(options, callback);
});

module.exports = router;
