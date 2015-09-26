var express = require('express');
var router = express.Router();
var snippet = require('../services/snippet_analysis');

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.query.signed_request != undefined){
		var unhashedContext = req.query.signed_request.split(".")[1];
		var data = JSON.parse(new Buffer(unhashedContext, 'base64'));
 		res.render('index', { project_id: data.context.environment.current_project });
	}
	res.render('index', { project_id: "" });
});

/* POST Analysis */
router.post('/analyze', function(req, res) {
	var project_id = req.body.project_id;
	snippet(req, function(results) {
		res.render('analyze', { snippet : results });
	})
});

module.exports = router;
