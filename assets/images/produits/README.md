# Dossiers images produits

Chaque produit du catalogue a maintenant **son propre dossier**, nommé d'après sa marque et son
modèle (ex : `kukirin-g2/`, `pure-electric-pure-air3/`...).

## Comment ajouter des photos

1. Ouvrez le dossier du produit concerné (le nom du dossier reprend la marque + le modèle).
2. Un fichier `LISEZ-MOI.txt` à l'intérieur vous rappelle les noms de fichiers attendus
   (généralement `1.jpg`, `2.jpg`, `3.jpg` selon le nombre de photos prévu pour ce produit).
3. Déposez vos photos avec exactement ces noms.
4. C'est tout — le site les affichera automatiquement, sans toucher au code.

## Formats acceptés

`.jpg`, `.jpeg`, `.png` ou `.webp` — peu importe le format déclaré dans `js/data.js`, le site
essaie automatiquement les 4 extensions les plus courantes. Vous pouvez donc déposer un `.png`
même si le fichier est nommé `1.jpg` dans le code : le site le trouvera quand même.

## Ajouter une photo supplémentaire à un produit

Par défaut, un produit a 1 ou 3 emplacements photo. Pour en ajouter un 4ᵉ :
1. Déposez le fichier (ex : `4.jpg`) dans le dossier du produit.
2. Dans `js/data.js`, repérez le produit et ajoutez une ligne dans son tableau `"images"` :
   ```
   "images": [
     "mon-produit/1.jpg",
     "mon-produit/2.jpg",
     "mon-produit/3.jpg",
     "mon-produit/4.jpg"
   ],
   ```

## Retrouver le dossier d'un produit précis

Le nom du dossier = marque + modèle, en minuscules, espaces remplacés par des tirets
(ex : "Pure Electric" + "Pure Air3" → `pure-electric-pure-air3`). Vous pouvez aussi ouvrir
`js/data.js`, chercher le produit par son nom, et lire directement le chemin dans son champ
`"images"` (la partie avant le `/` est le nom du dossier).

## Photos des avis clients

Les photos jointes aux avis clients (page produit, section "Avis clients" de l'accueil) sont
séparées et se trouvent dans `assets/images/avis/`. Elles sont référencées directement dans le
champ `"photo"` de chaque avis, dans `js/data.js`.
