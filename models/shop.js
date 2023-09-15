const mongoose = require('mongoose')

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    heroImage: { type: String },
    description: { type: String },
    rating: { type: Number, default: 0 },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
})

module.exports = mongoose.model('Shop', shopSchema)