const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
    },
});

const Product = mongoose.model('Product', productSchema);

exports.Product = Product;