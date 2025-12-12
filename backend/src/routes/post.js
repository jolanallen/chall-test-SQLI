const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middlewares/auth'); // Assurez-vous que le chemin est correct


router.get('/feed', auth(), async (req, res) => {
  try {
    const [posts] = await pool.query(`
      SELECT Post.id, Post.content, Post.createdAt, User.username
      FROM Post
      LEFT JOIN Follower ON Follower.followingId = Post.authorId
      LEFT JOIN User ON User.id = Post.authorId
      WHERE Follower.followerId = ?
      ORDER BY Post.createdAt DESC
    `, [req.user.id]);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des posts du feed' });
  }
});

module.exports = router;
