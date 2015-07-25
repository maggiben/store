///////////////////////////////////////////////////////////////////////////////
// @file         : store.js                                                  //
// @summary      : Store schema & static helpers                             //
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

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Comment = new Schema({
    message: { type: String, required: true, trim: true },
    created: { type: Date, default: Date.now },
    likes: { type: Number, required: false, default: 1},
    author: { type: Schema.Types.ObjectId, ref: 'User' }
});

var Store = new Schema({
    name: { type: String, required: true},
    description: { type: String, required: true},
    created: { type: Date, default: Date.now },
    price: { type: Number, default: 0 },
    comments: [ Comment ]
});

///////////////////////////////////////////////////////////////////////////////
// toObject                                                                  //
///////////////////////////////////////////////////////////////////////////////

Store.set('toObject', { getters: true, virtuals: false });

if (!Store.options.toObject) {
    Store.options.toObject = {};
}
Store.options.toObject.transform = function (document, ret, options) {
    'use strict';

    delete ret.__v;
    return ret;
};

///////////////////////////////////////////////////////////////////////////////
// toJSON                                                                    //
///////////////////////////////////////////////////////////////////////////////

Store.set('toJSON', { getters: true, virtuals: false });

if (!Store.options.toJSON) {
    Store.options.toJSON = {};
}
Store.options.toJSON.transform = function (document, ret, options) {
    'use strict';

    delete ret.__v;
    return ret;
};

///////////////////////////////////////////////////////////////////////////////
// Compile schema to model                                                   //
///////////////////////////////////////////////////////////////////////////////
module.exports = mongoose.model('Store', Store);
