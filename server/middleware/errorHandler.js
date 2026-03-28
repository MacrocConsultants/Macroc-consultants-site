const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR]: ${err.message}`);
    
    // Default to 500 server error
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode).json({
      message: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  };
  
  module.exports = { errorHandler };