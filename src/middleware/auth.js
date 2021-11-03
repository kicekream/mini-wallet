const jwt = require ("jsonwebtoken");

function auth(req, res, next) {
    const token = req.header("x-auth-token");
    if(!token) return res.status(401).send("Access denied, no token provided")

    try {
        const decoded = jwt.verify(token, process.env.jwtPrivateKey)

        //this contains user_id, email, is_admin and is_banned
        req.user = decoded;
        if(req.user.is_banned) return res.status(403).send("You are unable to perform this transaction, please contact admin")
        next();
    }
    catch(error) {
        res.status(400).send("Invalid Token Provided");
    }
}

module.exports = {auth}