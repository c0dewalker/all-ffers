module.exports = function authenticationMiddleware() {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(401);
        res.json({message: 'You are not authenticated'});
    }
}