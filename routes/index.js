/*eslint no-undef: "error"*/
/*eslint-env node*/

var express = require('express');
var router = express.Router();
var util = require('util');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var fs = require("fs");
var path = require('path');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/upload', function(req, res, next){
    res.render('upload', { title: 'Image upload form' });
});

router.post("/upload", function(req, res, next){ 
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        // `file` is the name of the <input> field of type `file`
        console.log(files);
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
    });
    form.on('error', function(err) {
        console.error(err);
    });
    form.on('progress', function(bytesReceived, bytesExpected) {
        var percent_complete = (bytesReceived / bytesExpected) * 100;
        console.log(percent_complete.toFixed(2));
    });
    form.on('end', function(fields, files) {
        // /* Temporary location of our uploaded file */
        // var temp_path = this.openedFiles[0].path;
        // /* The file name of the uploaded file */
        // var file_name = this.openedFiles[0].name;
        // /* Location where we want to copy the uploaded file */
        // var new_location = 'E:/nodejs/LineBotTest/';

        // fs.readFile(temp_path, function(err, data) {
        //     fs.writeFile(new_location + file_name, data, function(err) {
        //         fs.unlink(temp_path, function(err) {
        //             if (err) {
        //                 console.error(err);
        //                 } else {
        //                 console.log("success!");
        //             }
        //         });
        //     });
        // });
        console.log('file path: ' + this.openedFiles[0].path);
        console.log('file name: ' + this.openedFiles[0].name);
    });
});

module.exports = router;
