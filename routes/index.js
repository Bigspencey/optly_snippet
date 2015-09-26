var express = require('express');
var router = express.Router();
var snippet = require('../services/snippet_analysis');

/* GET home page. */
router.get('/', function(req, res, next) {
	var unhashedContext = req.query.signed_request.split(".")[1];
	var data = JSON.parse(new Buffer(unhashedContext, 'base64'));
 	res.render('index', { project_id: data.context.environment.current_project });
});

/* POST Analysis */
router.post('/analyze', function(req, res) {
	var project_id = req.body.project_id;
	snippet(req, function(results) {
		res.render('analyze', { snippet : results });
	})
});

/* POST OAuth */
router.post('/oauth', function(req, res) {

});

module.exports = router;
