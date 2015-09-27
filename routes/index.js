var express = require('express');
var router = express.Router();
var snippet = require('../services/snippet_analysis');

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.query.signed_request != undefined){
		var unhashedContext = req.query.signed_request.split(".")[1];
		var data = JSON.parse(new Buffer(unhashedContext, 'base64'));
 		res.render('index', { project_id: data.context.environment.current_project });
	} else {
		res.render('index', { project_id: "" });
	}
});

/* POST Analyze */
router.post('/analyze', function(req, res) {
	if (req.body.project_id != undefined){
		var project_id = req.body.project_id;
	} else {
		var project_id = Object.keys(req.body)[0];
	}
	snippet(project_id, function(results) {
		res.render('analyze', { snippet : results });
	});
});

module.exports = router;
