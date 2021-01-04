/**
 * Defines the API for showing deals for ACME partner hotels
 */
var RESOURCE_NAME = 'users';
var VERSION = 'v1';
var URI = '/' + VERSION + '/' + RESOURCE_NAME;

// Setup the vacations db
var db = require('../../db/users')
var memoryCache = require("memory-cache");
var cache = (duration) => {
    return (req, res, next) => {
        let key = "_express_" + req.originalUrl || req.url;
        let cachedBody = memoryCache.get(key);
        if (cachedBody) {
            res.send(cachedBody);
            return;
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                memoryCache.put(key, body, duration * 1000);
                res.sendResponse(body);
            };
            next();
        }
    };
};

module.exports = function (router) {
    'use strict';

    router.route(URI).get(cache(60), function (req, res, next) {
        console.log("GET Users")

        //1. fields
        var fields = {}
        if (req.query && req.query.fields !== undefined) {
            fields = createFields(req.query.fields)
        }

        //2. paginations
        var pagination = { limit: 0, offset: 0 }
        if (req.query && req.query.limit !== undefined) {
            // checks should be made that limit is a number
            pagination.limit = req.query.limit
        }
        if (req.query && req.query.offset !== undefined) {
            // checks should be made that limit is a number
            pagination.offset = req.query.offset
        }

        //2. Setup options
        var options = { fields: fields, pagination: pagination }
        console.log(options)

        //3. execute the query
        var criteria = {}
        db.select(criteria, options, function (err, docs) {

            if (err) {
                console.log(err)
                res.status(500)
                res.send("Error connecting to db")
            } else {
                if (docs.length == 0) {
                    res.status(404)
                }
                console.log("Retrieved users = %d", docs.length)

                // 4. Set the Link header - Left as an exercise for the students
                // Link : <url-to-next-page>; rel="next",
                //        <url-to-last-page>; rel="last"
                res.set("Cache-control", "public, max-age=60");
                res.send(docs)
            }
        });
    });

    router.route(URI).post(function (req, res, next) {
        console.log("POST  Users")

        //1. Get the data
        var doc = req.body;

        //2. Call the insert method
        db.save(doc, function (err, saved) {
            if (err) {
                // Creates the error response
                // EARLIER it was >>>  res.status(400).send("err")
                var userError = processMongooseErrors(apiMessages.errors.API_MESSAGE_CREATE_FAILED, "POST", URI, err, {});
                res.setHeader('content-type', 'application/json')
                res.status(400).send(userError)
            } else {
                res.send(saved)
            }
        });
    });
}

// Utility function to create the JSON
// Simply parse the received fields and create a valid JSON object
// {field1:1, field2:1 ....}
function createFields(str) {
    var arr = str.split(',')
    str = '{'
    for (var i = 0; i < arr.length; i++) {
        str += '\"' + arr[i] + '\":1'
        if (i < arr.length - 1) str += ","
    }
    str += '}'
    return JSON.parse(str)
}
