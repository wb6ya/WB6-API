const errorHandler = (err, req, res, next) => {
    console.error("ERROR HANDLER CAUGHT:", err.message);
    
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const errorMsg = err.message || "حدث خطأ غير متوقع في الخادم";
    
    // Only send the stack trace in development mode
    const stack = process.env.NODE_ENV === "development" ? err.stack : undefined;

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: errorMsg,
        error: err.name || "ServerError",
        timestamp: new Date().toISOString(),
        stack
    });
};

export default errorHandler;