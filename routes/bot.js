/*eslint no-undef: "error"*/
/*eslint-env node*/
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */

var express = require('express');
var router = express.Router();

var request = require('request');

var app = express();
var bodyParser = require('body-parser');
// var multer = require('multer'); // v1.0.5
// var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.urlencoded({
    extended: true
}));

router.post('/',function(req, res){
    if(req.body != undefined) {
        var i;
        for(i = 0; i < req.body.events.length; i++) {
            if(req.body.events[i].type == 'message' && req.body.events[i].message.type == 'text') {
                var message = {
                    'type': 'text',
                    'text': req.body.events[i].message.text
                };

                var data = {
                    'replytoken': req.body.events[i].replyToken,
                    'message': message
                };

                var headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer r66gB/QeQB9YKgvhT9QZoXmRuf0VIIIfsKiszE6+Qa0P2goun2p1hqBhuJwlTZNA5VOeojEffX95TJB162tqBXNWLxfuQzVlfuThpbzhtPhs9HddCEtj0+GxlJXufpEMAdHAhuu0INpJZxZudiYbYAdB04t89/1O/w1cDnyilFU='
                };

                console.log(data);

                var options = {
                    url: 'https://api.line.me/v2/bot/message/reply',
                    method: 'POST',
                    headers: headers,
                    body: data
                };

                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body);
                    }
                });
            }
        }
    }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('bot respond with a resource');
});

module.exports = router;
