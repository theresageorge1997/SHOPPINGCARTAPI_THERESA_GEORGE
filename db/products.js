/**
 * All database operations related to the vacations collection will reside in this file
 */
var model = require('../models/products')
var settings = require('./settings')

// CREATE the vacation package
exports.save = function (data, callback) {

    new model.Products(data).save(function (err, inserted) {
        callback(err, inserted)

    })
}

// CREATE multiple vacation packages
exports.saveMany = function (rows, callback) {

    model.Products.insertMany(rows, function (err, docs) {
        callback(err, docs)
    })

}

// UPDATE the vacation packages
// http://mongoosejs.com/docs/api.html#model_Model.update
exports.update = function (criteria, doc, callback) {
    // Replaced .update() with .updateMany() as .update() is deprecated
    model.Products.updateMany(criteria, doc, function (err, data) {
        callback(err, data)

    })
}

// RETRIEVE vacation packages based on criteria
exports.select = function (criteria, callback) {
    model.Products.find(criteria, function (err, data) {
        callback(err, data)
    })
}
