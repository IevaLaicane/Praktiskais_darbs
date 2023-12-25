const mongoose = require('mongoose');
require('dotenv/config');


const { productSchema } = require('./models/product');


async function transferData() {
    let wareshopConnection;
    try {
        wareshopConnection = mongoose.createConnection(process.env.WARESHOP_CONNECTION_STRING, {
            dbName: 'database',
        });

        const sharedProductSchema = new mongoose.Schema(productSchema.obj);

        const WareshopProduct = wareshopConnection.model('Product', sharedProductSchema);


        const shopConnection = await mongoose.createConnection(process.env.CONNECTION_STRING, {
            dbName: 'database_shop',
        });

        const Product = shopConnection.model('Product', sharedProductSchema);

        const wareshopProducts = await WareshopProduct.find();

        await Product.deleteMany({});

        for (const wareshopProduct of wareshopProducts) {
            const shopProduct = new Product({
                code: wareshopProduct.code, 
                name: wareshopProduct.name,
                description: wareshopProduct.description,
                price: wareshopProduct.price,
                countInStock: wareshopProduct.countInStock,
            });

            await shopProduct.save();
        }

        console.log('Data transfer completed successfully.');
    } catch (error) {
        console.error('Error transferring data:', error);
    } finally {

        if (wareshopConnection) {
            await wareshopConnection.close();
        }
    }
}

async function transferCount() {
    let wareshopConnection;
    try {
        wareshopConnection = mongoose.createConnection(process.env.WARESHOP_CONNECTION_STRING, {
            dbName: 'database',
        });

        const sharedProductSchema = new mongoose.Schema(productSchema.obj);

        const WareshopProduct = wareshopConnection.model('Product', sharedProductSchema);

        const shopConnection = await mongoose.createConnection(process.env.CONNECTION_STRING, {
            dbName: 'database_shop',
        });

        const Product = shopConnection.model('Product', sharedProductSchema);

        const wareshopProducts = await WareshopProduct.find();

        for (const wareshopProduct of wareshopProducts) {
            const shopProduct = await Product.findOne({ code: wareshopProduct.code });

            if (shopProduct) {
                await Product.updateOne(
                    { code: wareshopProduct.code },
                    { $set: { countInStock: wareshopProduct.countInStock } }
                );
            }
        }

        console.log('Data transfer completed successfully.');
    } catch (error) {
        console.error('Error transferring data:', error);
    } finally {
        if (wareshopConnection) {
            await wareshopConnection.close();
        }
    }
}

module.exports = { transferData, transferCount };