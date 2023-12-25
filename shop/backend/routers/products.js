const { Product } = require('../models/product');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const { transferData, transferCount } = require('../datatransfer');


router.post('/trigger-data-update', async (req, res) => {
    try {

        await transferData();
        res.status(200).json({ success: true, message: 'Data update from warehouse completed.' });
    } catch (error) {
        console.error('Error updating data from warehouse:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.post('/:code/update-stock-count-warehouse', async (req, res) => {
    try {
        const productCode = req.params.code;

        const product = await Product.findOne({ code: productCode });

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        await transferCount(productCode);

        res.status(200).json({ success: true, countInStock: product.countInStock });
    } catch (error) {
        console.error('Error updating stock count:', error);

        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const productList = await Product.find();
        res.send(productList);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


module.exports = router;
