# Luxe Shop Manager — Site vitrine statique (v2)

Site vitrine 100% statique (HTML/CSS/JS pur, zéro backend) pour la vente de motos, trottinettes et vélos électriques, pièces détachées et accessoires. Commande et contact envoyés via **WhatsApp** (+49 178 7478161). Disponible en **français, anglais et allemand**.

## Ce qui a changé dans cette version

- **Design** : nouveau thème blanc premium (encre + laiton), fini le noir/or/glassmorphism générique. Typographie Inter + Fraunces.
- **Icônes** : toutes les icônes sont de vrais SVG (`js/icons.js`), plus aucun emoji sur le site.
- **Trilingue FR/EN/DE** : sélecteur de langue dans le header, tout le site se retraduit instantanément sans rechargement (`js/i18n.js`).
- **Carrousels** : galerie produit (multi-photos, miniatures synchronisées), best-sellers en accueil, avis clients — tous en carrousel horizontal avec flèches + molette (`js/carousel.js`).
- **Avis clients** : nouvelle section témoignages en accueil, agrégée automatiquement depuis les avis du catalogue.
- **Boutons retour** ajoutés sur comparateur, favoris, article de blog, checkout.
- **Images produits réelles** : chaque produit pointe vers `assets/images/produits/<fichier>` (voir plus bas) ; en l'absence de photo, une icône SVG élégante prend le relais automatiquement (aucune balise cassée).

## Structure

```
luxe/
├── index.html            Accueil (hero, marques, best-sellers en carrousel, avis clients)
├── shop.html              Catalogue (filtres, tri, recherche, pagination, vue grille/liste)
├── product.html            Fiche produit (?id=1) — galerie carrousel
├── compare.html            Comparateur (?ids=1,2,3)
├── wishlist.html           Favoris
├── checkout.html           Commande (formulaire + envoi WhatsApp)
├── confirmation.html      Page de remerciement (confettis)
├── livraison.html          Carte Europe (Leaflet) + simulateur + tableau des délais
├── blog.html / blog-article.html   Articles conseils (traduits FR/EN/DE)
├── faq.html                FAQ en accordéon
├── contact.html            Formulaire de contact → WhatsApp
├── about.html              À propos / équipe
├── cgv.html / rgpd.html / garantie.html   Pages légales
├── css/main.css            Design system (palette blanche premium, carrousels, responsive)
├── js/
│   ├── data.js             62 produits (10 marques + pièces/accessoires), pays de livraison
│   ├── i18n.js              Dictionnaires FR/EN/DE + moteur de traduction t()/setLang()
│   ├── icons.js              Bibliothèque d'icônes SVG
│   ├── carousel.js           Composant carrousel horizontal générique
│   ├── utils.js              Helpers, loader, dark mode, langue, cookie banner, images produits
│   ├── cart.js               Panier + wishlist (localStorage)
│   ├── products.js           Rendu grille, filtres, tri, recherche, comparateur
│   ├── whatsapp.js           Génération des messages WhatsApp (conseil, commande, contact, newsletter)
│   ├── checkout.js           Validation formulaire + code promo + récap commande
│   └── app.js                Header/footer partagés, pages, repaint i18n (renderApp)
├── assets/images/produits/  Déposer ici les photos produits (voir data.js → champ "images")
└── README.md
```

## Ajouter les vraies photos produits

Dans `js/data.js`, chaque produit a un tableau `images: ["fichier1.jpg", "fichier2.jpg", ...]`. Déposez simplement les fichiers correspondants dans `assets/images/produits/` : ils s'afficheront automatiquement en galerie carrousel. Tant qu'un fichier est absent, une icône de remplacement s'affiche proprement (aucune erreur visible).

## Changer le numéro WhatsApp

Modifier la constante `WHATSAPP_NUMBER` dans `js/utils.js` (format international sans le `+`), et les liens `https://wa.me/...` codés en dur dans les pages HTML/`app.js`.

## Ajouter ou corriger une traduction

Tout le texte du site (hors données produits) vit dans `js/i18n.js`, sous forme de trois objets `fr`, `en`, `de`. Chaque clé existe dans les trois langues avec la même structure — repérez la clé dans `fr`, modifiez la même clé dans `en`/`de`.

## Déploiement

Aucun build requis. Déposez le dossier tel quel sur :
- **Netlify** : glisser-déposer le dossier sur app.netlify.com/drop
- **IONOS / FTP** : uploader tous les fichiers à la racine du répertoire web
- **Test local** : ouvrir `index.html` dans un navigateur, ou lancer `python3 -m http.server` dans le dossier

## Notes techniques

- La carte de livraison utilise Leaflet + OpenStreetMap via CDN (nécessite une connexion internet), tout comme les polices Google Fonts.
- Testé : les 16 pages chargent sans erreur JavaScript, panier/favoris/comparateur/filtres/validation de commande vérifiés fonctionnels de bout en bout.
