# Library Manager – Gestionnaire de Bibliothèque Académique

## Présentation

**Library Manager** est une application web destinée à la gestion d’une bibliothèque académique. Elle permet de gérer les livres, les utilisateurs, les emprunts, ainsi que la publication d’articles et de contenus académiques.

Le projet est basé sur une architecture moderne avec **React Vite** pour le frontend et **Django / Django REST Framework** pour le backend.

---

## Objectifs du projet

* Digitaliser la gestion d’une bibliothèque académique
* Faciliter l’accès aux ressources documentaires
* Assurer un suivi efficace des emprunts et retours
* Centraliser la publication d’articles et de contenus académiques
* Offrir une plateforme moderne et évolutive

---

## Fonctionnalités

### Gestion de la bibliothèque

* Gestion des livres (ajout, modification, suppression)
* Gestion des catégories et auteurs
* Recherche et consultation du catalogue
* Gestion des emprunts et des retours
* Suivi des disponibilités et des retards

### Gestion des articles et publications

* Publication d’articles académiques
* Création, modification et suppression des publications
* Consultation des articles publiés
* Modération et validation des publications
* Historique des publications par utilisateur

### Gestion des utilisateurs

* Authentification et autorisation
* Gestion des rôles (administrateur, bibliothécaire, utilisateur)
* Tableau de bord avec statistiques

---

## Types d’utilisateurs

### Administrateur

* Gestion complète des utilisateurs
* Gestion des livres et des publications
* Validation et modération des contenus
* Accès aux statistiques globales

### Bibliothécaire

* Gestion des emprunts et retours
* Suivi des livres et des retards
* Assistance aux utilisateurs

### Étudiant / Enseignant

* Consultation du catalogue
* Emprunt de livres
* Consultation et publication d’articles académiques
* Suivi de ses emprunts et publications

---

## Technologies utilisées

* Frontend : React.js
* Backend : Django (Python)
* API : Django REST Framework
* Base de données : SQLite (développement), PostgreSQL ou MySQL (production)
* Outils : Git, GitHub, Node.js, npm

---

## Installation et exécution

### Prérequis

* Node.js et npm
* Python 3.x
* pip et virtualenv (recommandé)

### Cloner le projet

```bash
git clone https://github.com/ivan-14-dev/library-Manager.git
cd library-Manager
```

### Backend (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

API disponible sur : [http://localhost:8000](http://localhost:8000)

### Frontend (React VIte )

```bash
cd frontend
npm install
npm run dev
```

Application disponible sur : [http://localhost:3000](http://localhost:3000)

---

## Évolutions futures

* Réservation de livres en ligne
* Gestion des livres numériques
* Système de pénalités automatique
* Notifications par email
* Application mobile

---

## Auteur

Ivan BAYIGA BOGMIS

---

## Licence

Ce projet est destiné à un usage académique et pédagog
