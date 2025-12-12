// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');


router.get('/', auth(['ADMIN']), async (req, res) => {
    const flag = process.env.FLAG;
    res.json({ flag });
}
);

module.exports = router;
