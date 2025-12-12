const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
    return (req, res, next) => {
        const tokenWithBarear = req.headers['authorization'];
        const token = tokenWithBarear ? tokenWithBarear.split(' ')[1] : null;
        if (!token) return res.status(401).json({ message: 'Accès interdit' });

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err){ 
                return res.status(403).json({ message: 'Token invalide' });
            }
            if (!roles.includes(user.role) && roles.length) {
                return res.status(403).json({ message: 'Accès non autorisé' });
            }

            req.user = user;
            next();
        });
    };
};
