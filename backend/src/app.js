const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const adminRoutes = require('./routes/admin');
const cors = require('cors');
const crypto = require('crypto');
process.env.JWT_SECRET = crypto.randomBytes(12).toString('hex');

app.use(express.json());

app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;
