/*eslint no-undef: "error"*/
/*eslint-env node*/
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */

var express = require('express');
var router = express.Router();

var request = require('request');
// var fs      = require('fs');

var app = express();
var bodyParser = require('body-parser');

var gcs = require('@google-cloud/storage')({
  projectId: '<projectID>',
  keyFilename: '/app/testfacebook-37d35-firebase-adminsdk-xjhtw-a095d994f6.json'
});

var streamifier = require('streamifier');

var bucket = gcs.bucket('testfacebook-37d35.appspot.com');

app.use(bodyParser.urlencoded({
    extended: true
}));

router.post('/',function(req, res){
    if(req.body != undefined) {
        console.log('request body: ' + JSON.stringify(req.body));
        var i;
        var headers;
        var options;
        for(i = 0; i < req.body.events.length; i++) {
            if(req.body.events[i].type == 'message') {
                if(req.body.events[i].message.type == 'text') {
                    var message = {
                        'type': 'text',
                        'text': req.body.events[i].message.text
                    };

                    var data = {
                        'replyToken': req.body.events[i].replyToken,
                        'messages': [message]
                    };

                    headers = {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer r66gB/QeQB9YKgvhT9QZoXmRuf0VIIIfsKiszE6+Qa0P2goun2p1hqBhuJwlTZNA5VOeojEffX95TJB162tqBXNWLxfuQzVlfuThpbzhtPhs9HddCEtj0+GxlJXufpEMAdHAhuu0INpJZxZudiYbYAdB04t89/1O/w1cDnyilFU='
                    };

                    console.log(JSON.stringify(headers));
                    console.log(JSON.stringify(data));

                    options = {
                        url: 'https://api.line.me/v2/bot/message/reply',
                        proxy: 'http://fixie:IaHUTllshvVDVfU@velodrome.usefixie.com:80',
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(data)
                    };

                    request(options, function (error, response, body) {
                        console.log("respond " + error + " " + JSON.stringify(response) + " " + JSON.stringify(body));
                        res.send(JSON.stringify(response));
                        if (!error && response.statusCode == 200) {
                            console.log(body);
                        }
                    });
                } else if(req.body.events[i].message.type == 'image') {
                    headers = {
                        'Authorization': 'Bearer r66gB/QeQB9YKgvhT9QZoXmRuf0VIIIfsKiszE6+Qa0P2goun2p1hqBhuJwlTZNA5VOeojEffX95TJB162tqBXNWLxfuQzVlfuThpbzhtPhs9HddCEtj0+GxlJXufpEMAdHAhuu0INpJZxZudiYbYAdB04t89/1O/w1cDnyilFU='
                    };

                    options = {
                        url: 'https://api.line.me/v2/bot/message/' + req.body.events[i].message.id + '/content',
                        proxy: 'http://fixie:IaHUTllshvVDVfU@velodrome.usefixie.com:80',
                        headers: headers,
                        encoding: null,
                        method: 'GET'
                    };

                    request(options, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            // console.log('type: ' + typeof(body));
                            // console.log('content: ' + body);
                            // console.log('content json: ' + JSON.stringify(body));
                            // res.send(typeof(body));

                            // var blob = bucket.file("test.jpg");
                            // var blobStream = blob.createWriteStream({
                            //     metadata: {
                            //         contentType: 'image/jpeg',
                            //         metadata: {
                            //             custom: 'metadata'
                            //         }
                            //     }
                            // }).on('error', function(err){
                            //     console.log('error: ' + err);
                            //     res.send("error: " + err);
                            //     return;
                            // }).on('finish', function(){
                            //     console.log('success');
                            //     res.status(200).send('success');
                            // });
                            // streamifier.createReadStream(body).pipe(blobStream);
                            var photo_meta = {
                                        'id': '999999999',
                                        'fname': 'fname',
                                        'lname': 'lname',
                                        'email': 'email',
                                        'profile_url': 'profile_url',
                                        'share': 'share'
                                    };

                            var headers = {
                                'Content-Type': 'multipart/form-data'
                                };

                            // console.log("########formData######" + formData);
                            // console.log("########photo_meta######" + formData.photo_meta);
                            // console.log("########photo_file######" + formData.photo_file);


                            var reqPost = request.post({url:'https://stormy-ravine-12403.herokuapp.com/upload', headers: headers}, function optionalCallback(err, httpResponse, body) {
                                if (err) {
                                    console.error('upload failed:', err);
                                } else {
                                    console.log('Upload successful!  Server responded with:', body);
                                }
                            });

                            var form = reqPost.form();
                            form.append('hashtag', 'selfitest');
                            form.append('photo_meta', JSON.stringify(photo_meta));
                            form.append('file', body, {
                                filename: 'myfile.jpg',
                                contentType: 'image/jpg'
                            });

                        } else {
                            console.log('error');
                            res.send("error");
                        }
                    });
                }
            }
        }
    }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.type('jpg'); 
    var file = bucket.file("test.jpg");
    file.download().then(function(data) {
        var contents = data[0];
        res.end(contents, 'binary');
    });
});

module.exports = router;
