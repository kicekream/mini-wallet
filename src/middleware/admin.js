function admin(req, res, next) {
    if(req.user.is_admin === false) return res.status(403).send("Access Denied.");
    next();
}

module.exports = {admin};