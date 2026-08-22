// ===== Envoi de commande (WhatsApp) et contact (email) =====
// WhatsApp n'est utilisé ici que pour transmettre une commande déjà passée sur le site.
// Aucune fonctionnalité de discussion/chat avec l'administrateur n'est proposée : seule la
// validation d'une commande ouvre un message WhatsApp pré-rempli vers l'équipe.

function envoyerCommandeWhatsApp(commande) {
  const nbArticles = commande.panier.reduce((s, i) => s + i.qty, 0);
  const lignes = commande.panier
    .map(i => `• ${i.produit.marque} ${i.produit.modele} (x${i.qty}) : ${formatPrice(i.total)}`)
    .join('\n');
  const livraisonTxt = commande.fraisLivraison === 0 ? 'offerte' : `${formatPrice(commande.fraisLivraison)}`;
  const promoTxt = commande.codePromo ? ` J'ai également utilisé le code promo ${commande.codePromo}, dont la réduction est déjà déduite ci-dessous.` : '';

  const message =
`Bonjour, je souhaite finaliser la commande suivante passée sur Kukir1n.

Mon code de suivi de commande est : ${commande.suivi}

Je m'appelle ${commande.prenom} ${commande.nom}, vous pouvez me joindre au ${commande.telephone} ou par email à ${commande.email}. Merci de livrer à l'adresse suivante : ${commande.adresse}, ${commande.codePostal} ${commande.ville}, ${commande.pays}.

Voici le détail de mon panier (${nbArticles} article${nbArticles > 1 ? 's' : ''}) :
${lignes}

Le sous-total s'élève à ${formatPrice(commande.sousTotal)}, avec des frais de livraison ${livraisonTxt} (délai estimé : ${commande.delai}).${promoTxt} Le total à régler est donc de ${formatPrice(commande.total)}.

Pouvez-vous me confirmer la disponibilité et m'indiquer les modalités de paiement ? Merci beaucoup, dans l'attente de votre retour.`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

// Contact et newsletter passent par email (mailto), pas par WhatsApp : aucun canal de
// discussion directe avec l'administrateur n'est ouvert depuis ces formulaires.
function contactFormMail(nom, email, message) {
  const subject = `Contact Kukir1n - ${nom}`;
  const body = `Nom : ${nom}\nEmail : ${email}\n\nMessage :\n${message}`;
  window.open(`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
}

function newsletterSignup(email) {
  const subject = 'Inscription newsletter';
  const body = `Inscription newsletter Kukir1n : ${email}`;
  window.open(`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
}
