/**
 * Standardizes API responses for success and error cases.
 * Ensures consistent JSON formatting across all endpoints.
 */

const sendSuccess = (res, data, statusCode = 200) => {
    return res.status(statusCode).json(data);
};

const sendError = (res, errorMsg, statusCode = 500) => {
    return res.status(statusCode).json({ error: errorMsg });
};

module.exports = {
    sendSuccess,
    sendError
};
