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

app.use(`${api}/products`, productsRouter);

mongoose.connect(process.env.CONNECTION_STRING, {
    dbName: 'database'
})
.then(() => {
    console.log('Database Connection is Ready');
})
.catch((err) => {
    console.log(err);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});