const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.router');
const productRoutes = require('./routes/product.router');
const partyRoutes = require('./routes/party.router');
const transportRoutes = require('./routes/transport.router');
const orderRoutes = require('./routes/order.router');
const dashboardRoutes = require('./routes/dashboard.router')
const notificationRouter = require('./routes/notification.router')

const app = express();

app.use(cors({
  origin: 'https://frontend-oms.vercel.app',
  credentials: true
}));

// app.use(cors({
//   origin: true,
//   credentials: true
// }));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/party', partyRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifiaction', notificationRouter);


module.exports = app
