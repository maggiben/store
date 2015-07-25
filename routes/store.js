var express = require('express')
  , router = express.Router()
  , Store = require('../controllers/store');


///////////////////////////////////////////////////////////////////////////////
// Store CRUD Methods                                                        //
///////////////////////////////////////////////////////////////////////////////
router.route('/')
    .post(Store.create)
    .get(Store.read);
router.route('/:id')
    //.get(Store.readOne)
    .put(Store.update)
    .delete(Store.delete);

module.exports = router;
