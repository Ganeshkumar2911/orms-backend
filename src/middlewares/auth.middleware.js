const jwt = require('jsonwebtoken');

async function authUser(req, res, next) {

    const token = req.cookies.token;

    // console.log("Cookies:", req.cookies);
    // console.log("Token:", req.cookies?.token);
    // console.log("JWT Secret:", !!process.env.JWT_SECRET);

    // console.log("Origin:", req.headers.origin);
    // console.log("Cookie Header:", req.headers.cookie);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        console.log(error);

        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });

    }

}

module.exports = { authUser };