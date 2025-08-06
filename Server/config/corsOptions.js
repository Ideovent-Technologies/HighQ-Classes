const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:8080',
  'http://localhost:8081',
  // 'https://highq-classes.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    const normalizedOrigin = origin?.replace(/\/$/, "");
    if (allowedOrigins.includes(normalizedOrigin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;