const mongoose = require('mongoose');

module.exports = () => {
  const env = process.env.NODE_ENV || "development";

  // Pick URI based on environment
  const mongoURI =
    env === "production"
      ? process.env.MONGO_URI_CLOUD   // Cloud (Atlas)
      : process.env.MONGO_URI_LOCAL;  // Local

  mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`MongoDB connected successfully to ${env} database`);
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
    });
};
