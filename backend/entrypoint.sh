#!/bin/sh
while true; do
  curl -s mysql:3306 >/dev/null
  result=$?

  if [ $result -eq 1 ]; then
    echo "mysql est prêt !"
    break
  else
    echo "En attente de mysql..."
    sleep 1
  fi
done

set -e  # Exit immediately if a command exits with a non-zero status

echo "Création de la base de données et des tables..."
mysql -h mysql -u root -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} < /app/init.sql

echo "Exécution du script de seed..."
node /app/src/seed.js

echo "Démarrage du serveur..."
npm start
 
