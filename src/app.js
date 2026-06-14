const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.router');
const productRoutes = require('./routes/product.router');
const partyRoutes = require('./routes/party.router');
const transportRoutes = require('./routes/transport.router');
const orderRoutes = require('./routes/order.router');
const dashboardRoutes = require("./routes/dashboard.router");

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (e.g. mobile apps, curl)
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Vercel/Express5 friendly preflight handling (avoid wildcard route patterns)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/party', partyRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/order', orderRoutes);
app.use("/api/dashboard", dashboardRoutes);


module.exports = app
