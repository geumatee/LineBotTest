/*eslint no-undef: "error"*/
/*eslint-env node*/

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/',function(req, res){
  console.log('index post req: ' + req.body);
  console.log('index post req json: ' + JSON.stringify(req.bode));
  res.render('index!');
});

module.exports = router;
