var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Optimizely Snippet Contents' });
});

/* POST Analysis */
router.post('/analyze', function(req, res) {

});

/* POST OAuth */
router.post('/oauth', function(req, res) {

});

module.exports = router;
