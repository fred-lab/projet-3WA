Pré Requis :
- MySQL > 5.7.7
- PHP 7.0 avec Imagick

Installation :
- Cloner le repo
- Faire un : 'composer install' puis 'composer dump-autoload'
- Créer une base de donnée MySQL
- Indiquer le nom de la base, le nom d'utilisateur et son mot de passe dans un fichier .env (non disponible sur le dépot)
- Exécuter les migrations : 'php artisan migrate'
- Remplir la base de donnée : 'php artisan db:seed'
- Installer les dépendances pour le front-end : 'npm install'
- Compiler les fichiers CSS et JS avec webpack : 'npm run dev' pour un environnement de dev, sinon 'npm run production' pour un environnement de prod.
