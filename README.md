# PyTechSolutions – Site officiel

![Django](https://img.shields.io/badge/Django-4.x-092E20?logo=django&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14+-000000?logo=nextdotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.12+-3776AB?logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)
![Status](https://img.shields.io/badge/Status-En%20développement-orange)
![License](https://img.shields.io/badge/License-Propriétaire-red)

Nouvelle version du site web de **PyTechSolutions**, actuellement en cours de développement.

Ce projet constitue la base technique du site vitrine de PyTechSolutions, avec une architecture moderne séparant clairement le backend et le frontend.  
L’objectif est de disposer d’un socle **propre**, **maintenable** et **évolutif**, prêt pour une mise en production professionnelle.

---

## 🧱 Architecture du projet

```
PytechSolutions_Next_Django/
├── cv-backend/    # Backend Django
│   ├── manage.py
│   ├── requirements.txt
│   └── ...
└── cv-frontend/   # Frontend Next.js
    ├── package.json
    ├── src/
    └── public/
```

---

## ⚙️ Technologies utilisées

### Backend
- **Python 3.12+**
- **Django**
- Django REST Framework (prévu / en cours)
- Architecture orientée API
- Gestion des données et logique métier côté serveur

### Frontend
- **Next.js**
- **React**
- CSS Modules
- **Framer Motion** pour les animations
- Architecture orientée composants

---

## 🎯 Objectifs du projet

- Présenter l’activité et les expertises de PyTechSolutions
- Servir de vitrine technologique de l’entreprise
- Disposer d’une base technique claire et professionnelle
- Faciliter l’évolution future (API, authentification, contenu dynamique)
- Préparer un déploiement moderne et scalable

---

## 🚧 État du projet

🟡 **En cours de développement**

Le projet est en phase active de conception et d’implémentation.  
La structure est amenée à évoluer, tout comme les fonctionnalités et le contenu.

---

## 🛠️ Installation locale (aperçu)

> ⚠️ Documentation détaillée à venir

### Backend
```bash
cd cv-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

### Frontend
```bash
cd cv-frontend
npm install
npm run dev
```

---

## 🚀 Déploiement (prévu)

- **Frontend** : déploiement indépendant (ex. Vercel)
- **Backend** : serveur dédié ou cloud (ex. VPS / Docker)
- Communication via API REST sécurisée

Les deux parties sont pensées pour fonctionner de manière totalement découplée.

---

## 📦 Bonnes pratiques appliquées

- Séparation claire backend / frontend
- Aucun fichier généré ou sensible versionné
- `.gitignore` strict (venv, node_modules, builds)
- Architecture prête pour CI/CD

---

## 📄 Licence

Projet propriétaire – Tous droits réservés.  
© PyTechSolutions