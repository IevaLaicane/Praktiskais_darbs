const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv/config');

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(morgan('tiny'));

const api = process.env.API_URL;
const productsRouter = require('./routers/products');
const { transferData, transferCount } = require('./datatransfer'); 


const { Product } = require('./models/product');


mongoose.connect(process.env.CONNECTION_STRING, {
    dbName: 'database_shop',
})
.then(() => {
    console.log('Database Connection is Ready');
})
.catch((err) => {
    console.error('Database Connection Error:', err);
});


mongoose.connection.on('close', () => {
    console.log('Database Connection Closed');
});

app.use(`${api}/products`, productsRouter);


app.post(`${api}/data-transfer`, async (req, res) => {
    try {
        await transferData();
        res.status(200).json({ success: true, message: 'Data update from warehouse completed.' });
    } catch (error) {
        console.error('Error updating data from warehouse:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.post(`${api}/:code/update-stock-count-warehouse`, async (req, res) => {
    try {
        const productCode = req.params.code;

        // Call the transferCount function to update the stock count
        await transferCount(productCode);

        console.log('Stock count updated successfully.');
        res.status(200).json({ success: true, message: 'Stock count updated successfully.' });
    } catch (error) {
        console.error('Error updating stock count:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


