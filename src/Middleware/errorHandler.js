const errorHandler = (err, req, res, next) => {
    console.error("ERROR HANDLER CAUGHT:", err);
    const errorStatusCode = err.statusCode || 500;
    const errorMsg = err.message || "Internal Server Error";
    
    // Only send the stack trace in development mode
    const stack = process.env.NODE_ENV === "development" ? err.stack : undefined;

    res.status(errorStatusCode).json({
        success: false,
        status: errorStatusCode,
        message: errorMsg,
        stack
    });
};

export default errorHandler;