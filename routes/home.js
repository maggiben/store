var express = require('express')
    , router = express.Router();

/* GET home page. */
router.get('/', function(request, response) {
    response.render('index', { title: 'Router' });
});


module.exports = router;
