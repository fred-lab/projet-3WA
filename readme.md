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
- S'assurer que les droits d'écritures soient accessibles sur les fichiers storage, public/galeries & /bootstrap/cache
- Vérifier que la table 'oauth_clients' possèdent les clés d'accès 'Personal Access Client' & 'Password Grant Client'. Si ces clés n'existent, il faut
les installer : 'php artisan passport:install'
- Dans le fichier 'ressources/assets/js/components/auth/Login.vue' s'assurer que la valeur 'client_secret' (ligne 30) soit égale à 'Password Grant Client'
dans la table 'oauth_clients'
- S'assurer que Nginx (ou Apache) & PHP acceptent l'upload de fichier lourds lors d'un post.


Utilisation :
- Se rendre sur la page 'http://localhost/studio/login' pour un environnement de dev
- Se connecter avec le compte user:'admin@demo.com' pwd:'secret'
- L'upload d'image et la boite de réception des messages seront accessibles


Version beta :
- Le site permet l'upload de photo, la création de galerie, la gestion de la galerie (ajout/suppression de photo, modification du nom de la galerie, photo d'en-tête)
se fait par des requêtes AJAX, sans rechargement de la page.
- La classe 'App\Services\FilesManager' gère l'upload des photos en créant/modifiant/supprimant les dossiers 'à la volée' grâce aux Event Eloquent.
- Les photos sont redimensionnées grâce à 'Intervention' et le driver 'Imagick'
- Les visiteurs peuvent envoyer des messages à l'administration et recevoir une réponse par mail.


Souhait d'évolution:
- Ajouter de transition lors du changement de route.
- Améliorer la gestion utilisateur (création/suppression de compte).
- Créer une zone privé pour échanger les photos avec les modèles.
- Créer une zone privé pour héberger et partager des albums de mariage.


Site visible ici : http://bokehlicious.fr