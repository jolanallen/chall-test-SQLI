// backend/src/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db'); 
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const [existingUser] = await pool.query(
      'SELECT * FROM User WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email ou nom d'utilisateur déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO User (email, username, password, role) VALUES (?, ?, ?, ?)',
      [email, username, hashedPassword, 'VIEWER']
    );

    res.status(201).json({ message: 'Compte créé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM User WHERE username = ?', [username]);
    const user = users[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user.id, role: user.role, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ message: 'Connexion réussie', token });
    } else {
      res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/publishers', auth(['VIEWER', 'PUBLISHER', 'ADMIN']), async (req, res) => {
  try {
    const [publishers] = await pool.query(
      'SELECT id, username, description FROM User WHERE role = ?',
      ['PUBLISHER']
    );
    res.json(publishers);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des publishers' });
  }
});

router.post('/follow/:publisherId', auth(), async (req, res) => {
  const { publisherId } = req.params;

  try {
    await pool.query(
      'INSERT INTO Follower (followerId, followingId) VALUES (?, ?)',
      [req.user.id, parseInt(publisherId)]
    );
    res.json({ message: 'Vous suivez maintenant cet utilisateur.' });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'abonnement" });
  }
});

router.delete('/unfollow/:publisherId', auth(), async (req, res) => {
  const { publisherId } = req.params;

  try {
    await pool.query(
      'DELETE FROM Follower WHERE followerId = ? AND followingId = ?',
      [req.user.id, parseInt(publisherId)]
    );
    res.json({ message: 'Vous vous êtes désabonné de cet utilisateur.' });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du désabonnement" });
  }
});

router.put('/update-profile', auth(), async (req, res) => {
  const { username, password, description } = req.body;

  if (!username && !password && description === undefined) {
    return res.status(400).json({ message: "Aucun champ à mettre à jour." });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  if (username && typeof username !== 'string') {
    return res.status(400).json({ message: "Le nom d'utilisateur doit être une chaîne de caractères." });
  }
  if (password && typeof password !== 'string') {
    return res.status(400).json({ message: "Le mot de passe doit être une chaîne de caractères." });
  }
  if (description && typeof description !== 'string') {
    return res.status(400).json({ message: "La description doit être une chaîne de caractères." });
  }

  try {
    const [userResult] = await pool.query('SELECT username, LENGTH(username) FROM User WHERE id = ?', [req.user.id]);
    const user = userResult[0];
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (username && username !== user.username) {
      const [existingUsers] = await pool.query('SELECT * FROM User WHERE username = ?', [username]);
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: "Nom d'utilisateur déjà utilisé." });
      }
    }
    
    const updates = [];
    const params = [];

    if (username) {
      updates.push("username = ?");
      params.push(username);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push("password = ?");
      params.push(hashedPassword);
    }

    if (description !== undefined) {
      updates.push("description = ?");
      params.push(description);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "Aucun champ à mettre à jour." });
    }

    params.push(user.username);
    const updateQuery = `UPDATE User SET ${updates.join(", ")} WHERE username = ?`;
    await pool.query(updateQuery, params);
    res.status(200).json({ message: 'Profil mis à jour' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
  }
});


module.exports = router;
