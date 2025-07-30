const allowedOrigins = [
    'http://localhost:5000',
    'http://localhost:8080', // For React/Vite frontend
    // 'https://highq-classes.vercel.app'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

export default corsOptions;