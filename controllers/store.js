///////////////////////////////////////////////////////////////////////////////
// @file         : store.js                                                  //
// @summary      : Store Controller                                          //
// @version      : 0.1                                                       //
// @project      : Node.JS + Express boilerplate for cloud9 and appFog       //
// @description  :                                                           //
// @author       : Benjamin Maggi                                            //
// @email        : benjaminmaggi@gmail.com                                   //
// @date         : 24 Jul 2015                                               //
// @license:     : MIT                                                       //
// ------------------------------------------------------------------------- //
//                                                                           //
// Copyright 2013~2015 Benjamin Maggi <benjaminmaggi@gmail.com>              //
//                                                                           //
//                                                                           //
// License:                                                                  //
// Permission is hereby granted, free of charge, to any person obtaining a   //
// copy of this software and associated documentation files                  //
// (the "Software"), to deal in the Software without restriction, including  //
// without limitation the rights to use, copy, modify, merge, publish,       //
// distribute, sublicense, and/or sell copies of the Software, and to permit //
// persons to whom the Software is furnished to do so, subject to the        //
// following conditions:                                                     //
//                                                                           //
// The above copyright notice and this permission notice shall be included   //
// in all copies or substantial portions of the Software.                    //
//                                                                           //
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS   //
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF                //
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.    //
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY      //
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,      //
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE         //
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.                    //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////


// Dependencies
var conf = require('../config'),
    mongoose = require('mongoose'),
    extend = require('util')._extend;

// Load model
var store_schema = require('../models/store'),
    Store = mongoose.model('Store', store_schema);

///////////////////////////////////////////////////////////////////////////////
// Route to create a Store item                                              //
//                                                                           //
// @param {Object} request                                                   //
// @param {Object} response                                                  //
// @param {Object} next                                                      //
// @return {Object} JSON newly created Store item                            //
//                                                                           //
// @api public                                                               //
//                                                                           //
// @url POST /store                                                          //
///////////////////////////////////////////////////////////////////////////////
exports.create = function(request, response, next) {
    'use strict';

    console.log("req: ", request.body);
    Store.findOne({name: request.body.name})
    .exec(function(error, store) {
        if (error) {
            response.statusCode = 500;
            return next(error);
        } else if (store) {
            response.statusCode = 409;
            return response.json({"title": "sucess", "message": "Store already exists", "status": "fail"});
        }
        var store = new Store({
            name: request.body.name,
            description: request.body.description,
            price: request.body.price || 0
        });
        console.log("store: ", store)
        store.save(function(error, store) {
            if (error || !store) {
                response.statusCode = 500;
                return response.json({"title": "sucess", "message": "Cannot save store", "status": "fail"});
            }
            response.statusCode = 201;
            console.log("save: ", store)
            return response.json(store);
        });
    });
};

///////////////////////////////////////////////////////////////////////////////
// Route to get read Store items                                             //
//                                                                           //
// @param {Object} request                                                   //
// @param {Object} response                                                  //
// @param {Object} next                                                      //
// @return {Object} JSON Collection of Store items                           //
//                                                                           //
// @api public                                                               //
//                                                                           //
// @url GET /store                                                           //
///////////////////////////////////////////////////////////////////////////////
exports.read = function (request, response, next) {
    'use strict';

    var defaults = {
        skip : request.body.skip || 0,
        limit : request.body.limit || 0
    };

    Store.find({
        $or: [{
            name: request.body.name
        }, {
            price: request.body.price,
        }, {
            created: request.body.created
        }, {
            description: request.body.description
        }]
    })
    .limit(defaults.limit)
    .skip(defaults.skip)
    .exec(function(error, store) {
        if (error) {
            response.statusCode = 500;
            return next(error);
        }
        if(!store) {
            response.statusCode = 404;
            return response.json({"title": "error", "message": "Not Found", "status": "fail"});
        }
        return response.json(store);
    });
};

///////////////////////////////////////////////////////////////////////////////
// Route to update a Store item                                              //
//                                                                           //
// @param {Object} request                                                   //
// @param {Object} response                                                  //
// @param {Object} next                                                      //
// @return {Object} JSON updated Store item                                  //
//                                                                           //
// @api public                                                               //
//                                                                           //
// @url PUT /store/:id                                                       //
///////////////////////////////////////////////////////////////////////////////
exports.update = function (request, response, next) {
    'use strict';

    delete request.body._id; // Cant change subdomain id

    Store.findOneAndUpdate({
        $or: [{
            _id: request.params.id
        }, {
            name: request.body.name
        }]
    }
    , request.body)
    .exec(function (error, store) {
        if (error) {
            response.statusCode = 500;
            return next(error);
        }
        if (!store) {
            response.statusCode = 404;
            return response.json({"title": "error", "message": "Not Found", "status": "fail"});
        }
        return response.json(store);
    });
};

///////////////////////////////////////////////////////////////////////////////
// Route to remove a Store item                                              //
//                                                                           //
// @param {Object} request                                                   //
// @param {Object} response                                                  //
// @param {Object} next                                                      //
// @return {Object} empty result                                             //
//                                                                           //
// @api public                                                               //
//                                                                           //
// @url DELETE /store/:name                                                  //
///////////////////////////////////////////////////////////////////////////////
exports.delete = function(request, response, next) {
    'use strict';

    Store.findOneAndRemove({name: request.user.name})
    .exec(function(error) {
        if (error) {
            response.statusCode = 500;
            return next();
        } else {
            // The request was processed successfully, but no response body is needed.
            response.statusCode = 204;
            return response.json({"title": "sucess", "message": "removed", "status": "ok"});
        }
    });

};

///////////////////////////////////////////////////////////////////////////////
// Route to remove all Store items                                           //
//                                                                           //
// @param {Object} request                                                   //
// @param {Object} response                                                  //
// @param {Object} next                                                      //
// @return {Object} empty result                                             //
//                                                                           //
// @api public                                                               //
//                                                                           //
// @url DEL /store                                                           //
///////////////////////////////////////////////////////////////////////////////
exports.deleteAll = function (request, response, next) {
    'use strict';

    Store.find({}).remove(function(error) {
        if (error) {
            response.statusCode = 500;
            return next();
        } else {
            // The request was processed successfully, but no response body is needed.
            response.statusCode = 204;
            return response.json({"title": "sucess", "message": "removed", "status": "ok"});
        }
    });
};
