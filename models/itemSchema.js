const Schema = require('mongoose').Schema

// Define the Mongoose Schema for the 'item' model
const itemSchema = new Schema({
    name: {
        required: true,
        type: String,
        set: function (value) {
            // Capitalize the first letter of each word in the name
            let split = value.split(' ')
            if (split.length === 1) return value.charAt(0).toUpperCase() + value.slice(1)

            split.forEach((string, index, array) => { array[index] = string.charAt(0).toUpperCase() + string.slice(1) })
            let toString = split.toString().replaceAll(',', ' ')
            return toString
        }
    },
    images: [{ type: String }],
    imageUrl: {
        // required: true,
        type: String
    },
    publicId: {
        // required: true,
        type: String,
        // unique: true
    },
    price: {
        required: true,
        type: Number,
        set: function (value) {
            return Math.round(value * 100) / 100
        }
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    description: {
        required: true,
        type: String
    },
    category: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    shop: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    }
}, {
    timestamps: true
})

module.exports = itemSchema