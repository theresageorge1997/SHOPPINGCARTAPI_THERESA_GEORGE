/**
 * "REST API Course"
 *
 * Model for the ACME vacation package.
 */

var settings = require('../db/settings')


var ProductsSchema = settings.mongoose.Schema(
    {
        title: { type: String, required: [true, 'Name is needed'] },
        description: { type: String, required: true },
        category: { type: String, required: true },
        price: Number,
        id: Number,
        image: { type: String, required: true },
    }
);

// Export the model
exports.Products = settings.mongoose.model('products', ProductsSchema)
