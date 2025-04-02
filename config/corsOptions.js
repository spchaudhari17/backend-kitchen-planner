
const cors = require('cors');
const { allowedOrigins, paths } = require('./allowedOrigins');

const publicPaths = ['/api/users/guest']; // Add public endpoints here

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true,
    optionsSuccessStatus: 200
};

const oauthCorsOptions = {
    origin: (origin, callback) => {
        callback(null, true);
    },
    methods: ['GET'],
    credentials: true,
    optionsSuccessStatus: 200
};

const corsMiddleware = (req, res, next) => {

    

    if (publicPaths.includes(req.path)) {
        // Allow public paths without CORS restrictions
        cors(oauthCorsOptions)(req, res, next);
    } else if (paths.includes(req.path)) {
        // Handle OAuth paths differently
        cors(oauthCorsOptions)(req, res, next);
    } else {
        // Apply standard CORS rules
        cors(corsOptions)(req, res, next);
    }
};

module.exports = corsMiddleware;
