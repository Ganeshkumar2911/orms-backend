const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.router');
const productRoutes = require('./routes/product.router');
const partyRoutes = require('./routes/party.router');
const transportRoutes = require('./routes/transport.router');






const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/party', partyRoutes);
app.use('/api/transport', transportRoutes);


module.exports = app