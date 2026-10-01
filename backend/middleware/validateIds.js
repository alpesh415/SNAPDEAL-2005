// Rejects invalid MongoDB ids early with a clear message
// (instead of a "Cast to ObjectId failed" 500 error).
const OBJECT_ID = /^[a-f\d]{24}$/i;

const FIELDS = ["userId", "productId", "orderId"];

const validateIds = (req, res, next) => {

    const sources = [req.body || {}, req.params || {}, req.query || {}];

    for (const source of sources) {

        for (const field of FIELDS) {

            const value = source[field];

            if (value !== undefined && !OBJECT_ID.test(String(value))) {

                return res.status(400).json({
                    success: false,
                    message: field === "userId"
                        ? "Invalid user session. Please logout, then register/login again."
                        : `Invalid ${field}`
                });

            }

        }

    }

    next();

};

module.exports = validateIds;
