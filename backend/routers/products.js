const { Product } = require('../models/product');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    try {
        const productList = await Product.find();
        res.send(productList);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:id/update-stock-count', async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, countInStock: product.countInStock });
    } catch (error) {
        console.error('Error fetching stock count:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(400).send('Invalid Product ID');
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                countInStock: req.body.countInStock,
            },
            { new: true }
        );

        if (!product) {
            return res.status(500).send('The product cannot be updated!');
        }

        res.send(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (product) {
            return res.status(200).json({ success: true, message: 'The product is deleted' });
        } else {
            return res.status(404).json({ success: false, message: 'Cannot be deleted, does exist' });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post(`/`, async (req, res) => {
    try {
        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            countInStock: req.body.countInStock,
        });

        product = await product.save();

        if (!product) {
            return res.status(500).send('The product cannot be created');
        }

        console.log('Product added:', product);

        res.send(product);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


router.get('/update-stock-counts', async (req, res) => {
    try {
        const stockCounts = await Product.find().select('countInStock');
        res.send(stockCounts);
    } catch (error) {
        console.error('Error updating stock counts:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(500).json({ success: false });
        }

        res.send(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;