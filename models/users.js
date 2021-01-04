/**
 * "REST API Course"
 *
 * Model for the ACME hotels
 */

var settings = require('../db/settings')


var UsersSchema = settings.mongoose.Schema(
    {
        /** No schema defined for hotels - Student may do it themselves */
        name: { type: String, required: [true, 'Name is needed'] },
        created: { type: Number, required: true },
        modified: Number,
        address1: { type: String, required: [true, 'Address is needed'] },
        airportCode: { type: String, required: true },
        city: { type: String, required: true },
        countryCode: { type: String, required: true },
        location: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true }
        },
        postalCode: { type: Number, required: true },

    },
    /** remove the following if you define the schema */
    //{ strict: false }
);

// Export the model
exports.Users = settings.mongoose.model('users', UsersSchema)
