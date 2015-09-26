var express = require('express');
var router = express.Router();
var snippet = require('../services/snippet_analysis');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Optimizely Snippet Contents' });
});

/* POST Analysis */
router.post('/analyze', function(req, res) {
	var project_id = req.body.project_id;
	snippet.retrieveSnippet(project_id);
});

/* POST OAuth */
router.post('/oauth', function(req, res) {

});

module.exports = router;
