
require('dotenv').config();
const express = require('express');
const path = require("path");
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require("helmet");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const corsMiddleware = require('./config/corsOptions');
const cors = require('cors');
const { logger } = require('./middleware/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const connectDB = require('./config/dbConn');
const setupSocket = require('./middleware/onlineStatus');
const passportSetup = require('./config/passportSetup');
const url = require('./config/url');
const {routerColors} = require('./routes/colorRoutes');
const roomDetails = require('./routes/roomDetailsRoute')
const productAdd = require('./routes/productsAdd')
// Import middleware
const requireAuth = require('./middleware/requireAuth');

const port = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: url, methods: ['GET', 'POST'] } });

// Connect to database
connectDB();
passportSetup();

// Middleware setup
app.use(helmet());
app.use(corsMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Session setup
app.use(session({
  secret: process.env.SESSION_TOKEN_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production' || false,
    sameSite: 'Lax',
    httpOnly: true,
  },
}));
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use(cors({
  origin: '*', // Sabhi origins allow kar raha hai (For Debugging)
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Ya frontend ka specific origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // ⭐ This is important
  next();
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(passport.initialize());

// Public routes
app.use('/api/users/guest', require('./routes/guest')); // Guest routes
app.use('/api/auth', require('./routes/auth')); // Authentication routes
app.use('/api/colors',routerColors)
app.use("/api/room-details", roomDetails);
app.use("/api/product", productAdd);
// Middleware for authenticated routes
app.use(requireAuth);

// Setup real-time socket connections
setupSocket(io);

// Authenticated routes
app.use('/api/users', require('./routes/user'));

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
mongoose.connection.once('open', () => {
  console.log('Database Connected Successfully!');
  server.listen(port, () => console.log(`Server running on port ${port}`));
});
