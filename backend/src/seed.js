const bcrypt = require('bcrypt');
const connection = require('./db');
async function main() {


  await connection.query('DELETE FROM Post');
  await connection.query('DELETE FROM Follower');
  await connection.query('DELETE FROM User');
  const topics = [
    { 
      username: 'RelicHunter', 
      email: 'relic@apoca.lypse', 
      description: 'Trouvailles post-explosion, reliques du passé et objets mystérieux', 
      postTopics: [
        "Ancienne relique découverte",
        "Artefacts mystérieux du vieux monde",
        "Objets de valeur après l'explosion"
      ]
    },
    { 
      username: 'SurvivorTracker', 
      email: 'tracker@apoca.lypse', 
      description: 'Suivi des traces des derniers survivants et refuges',
      postTopics: [
        "Nouvelle piste de survivants",
        "Réfuges potentiels trouvés",
        "Traces de vie humaine"
      ]
    },
    { 
      username: 'MutantSightings', 
      email: 'mutant@apoca.lypse', 
      description: 'Rapports et observations de créatures mutantes', 
      postTopics: [
        "Observation de mutants",
        "Nouveaux types de créatures",
        "Dangers mutants identifiés"
      ]
    },
    { 
      username: 'ApocalypseFashion', 
      email: 'fashion@apoca.lypse', 
      description: 'Tendances mode post-apocalyptique et tenues de survie',
      postTopics: [
        "Tendances mode de survie",
        "Nouvelles tenues de résistance",
        "Inspiration look apocalyptique"
      ]
    },
    { 
      username: 'ScavengerNews', 
      email: 'scavenger@apoca.lypse', 
      description: 'Actualités sur les meilleures zones à fouiller et les ressources', 
      postTopics: [
        "Zones de fouille recommandées",
        "Ressources trouvées",
        "Meilleurs endroits pour chercher"
      ]
    },
    { 
      username: 'SafeZoneReport', 
      email: 'safezone@apoca.lypse', 
      description: 'Zones sécurisées et nouvelles de refuges sûrs', 
      postTopics: [
        "Rapport de zone sécurisée",
        "Refuge découvert",
        "Mises à jour sur les zones sûres"
      ]
    },
    { 
      username: 'TechAfterFall', 
      email: 'tech@apoca.lypse', 
      description: 'Technologies récupérables et systèmes encore en marche',
      postTopics: [
        "Technologies encore fonctionnelles",
        "Systèmes récupérables",
        "Découvertes de technologie ancienne"
      ]
    },
    { 
      username: 'MysticRuins', 
      email: 'mystic@apoca.lypse', 
      description: 'Lieux mystérieux et ruines anciennes découvertes après le chaos', 
      postTopics: [
        "Exploration de ruines mystiques",
        "Anciennes structures découvertes",
        "Nouvelles trouvailles archéologiques"
      ]
    },
    { 
      username: 'SurvivalTips', 
      email: 'tips@apoca.lypse', 
      description: 'Conseils de survie, trucs et astuces pour le quotidien apocalyptique', 
      postTopics: [
        "Conseils pour survivre",
        "Astuces de survie quotidiennes",
        "Équipements indispensables"
      ]
    },
    { 
      username: 'RadioStatic', 
      email: 'radio@apoca.lypse', 
      description: 'Communications radio et messages mystérieux à travers les terres', 
      postTopics: [
        "Messages radio étranges",
        "Émissions mystérieuses captées",
        "Signaux et transmissions inconnus"
      ]
    },
  ];

  const startDate = new Date('2025-01-25');
  const endDate = new Date('2025-12-25');

  function getRandomDate(start, end) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    date.setMilliseconds(0); // Supprime les millisecondes
  
    // Formater la date en 'YYYY-MM-DD HH:MM:SS' pour MySQL
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  function generateRandomPassword(size) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < size; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
  }

  
  for (const topic of topics) {
    const plainPassword = generateRandomPassword(50);  // Générer un mot de passe de 12 caractères
    const hashedPassword = await bcrypt.hash(plainPassword, 10);  // Hasher le mot de passe
    const [result] = await connection.query(
      'INSERT INTO User (email, username, password, role, description) VALUES (?, ?, ?, ?, ?)',
      [topic.email, topic.username, hashedPassword, 'PUBLISHER', topic.description]
    );

    const publisherId = result.insertId;

    for (let i = 0; i < 7; i++) {
      const postContent = `${topic.postTopics[i % topic.postTopics.length]} - Information #${i + 1}`;
      const postDate = getRandomDate(startDate, endDate);

      await connection.query(
        'INSERT INTO Post (content, createdAt, authorId) VALUES (?, STR_TO_DATE(?, "%Y-%m-%d %H:%i:%s"), ?)',
        [postContent, postDate, publisherId]
            
      );
    }
  }

  const adminPassword = generateRandomPassword(50);
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);


  await connection.query(
    'INSERT INTO User (email, username, password, role) VALUES (?, ?, ?, ?)',
    ['admin@apoca.lypse', 'admin', hashedAdminPassword, 'ADMIN']
  );

  console.log('Seeding terminé !');
  await connection.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});