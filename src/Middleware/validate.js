const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const formattedErrors = result.error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message
            }));
            return res.status(400).json({ success: false, errors: formattedErrors });
        }
        next();
    };
};

export default validate;