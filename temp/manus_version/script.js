// ===================================================
//  WSH - Where Stuff Happens
//  Vanilla JS — Language switcher + mobile menu
// ===================================================

// ===== TRANSLATIONS =====
const translations = {
  en: {
    theProblem: "The Problem",
    ourSolution: "Our Solution",
    identity: "Identity",
    categories: "Categories",
    value: "Value",
    legal: "Legal",
    download: "Download",

    heroSubtitle: "The First Student Social Network",
    heroTagline: "Your uni, your thoughts, your voice. Unfiltered.",
    learnMore: "Learn More",

    problemTitle: "The Problem",
    problemSubtitle: "No Way to Connect",
    problemText1: "Currently, there is no easy or centralized way for students to reach their fellow students within a university. Students rely on scattered, unofficial channels like WhatsApp groups, Instagram stories, or mass emails.",
    problemText2: "These channels are fragmented, hard to navigate, and limited to small circles.",

    solutionTitle: "Our Solution",
    solutionSubtitle: "WSH - Where Stuff Happens",
    solutionText: "WSH is a private, school-centered social media platform designed exclusively for university students. It offers a secure environment where students can engage in discussions, share content, and connect with peers within their university community.",
    solutionFeature1: "Real-time student connections",
    solutionFeature2: "University-specific networks",
    solutionFeature3: "Safe and moderated environment",

    identityTitle: "You Choose How You Show Up",
    identityHandle: "Handle",
    identityHandleDesc: "Your unique username. Build your reputation over time.",
    identityAlias: "Alias",
    identityAliasDesc: "A reusable temporary name for contextual posting.",
    identityAnonymous: "Anonymous",
    identityAnonymousDesc: "Post without your name. Pure freedom of expression, taking away social pressure.",

    categoriesTitle: "Post Categories",
    categoriesSubtitle: "Organized Content",
    categoriesText: "Posts can be organized into categories by users, and users can browse these specific categories to find relevant content.",
    catPoll: "Poll",
    catQuestion: "Question",
    catConfession: "Confession",
    catAdvice: "Advice",
    catCrush: "Crush",
    catMeme: "Meme",
    catEvent: "Event",
    catAnnouncement: "Announcement",
    catDebate: "Debate",
    catLifeHack: "Life Hack",

    moderationTitle: "Moderation System",
    moderationSubtitle: "Safety First",
    moderationText: "Our moderation approach is built on two complementary layers: AI-powered moderation as the first line of defense, and Student Moderators for community-driven oversight.",
    moderationFeature1: "OpenAI content filtering + WebPurify AI image moderation",
    moderationFeature2: "Student moderator community with local context",
    moderationFeature3: "Real-time content review",
    moderationFeature4: "One-email-per-student security system",
    moderationNote: "Each student holds only one school email address. If a user is permanently banned, they cannot rejoin the platform.",

    valueTitle: "The Value",
    valueSubtitle: "Building Community",
    valueText: "The core value is providing an online space where students can freely express themselves in a space designed for them, without the pressures of traditional social media.",
    valueFeature1: "Connect with peers from your university",
    valueFeature2: "Stay updated with school news and events",
    valueFeature3: "Reach students across all years and campuses",
    valueFeature4: "Foster authentic community engagement",
    valueFeature5: "Exchange ideas and academic help",
    valueFeature6: "Share social experiences without pressure",

    independenceTitle: "Platform Independence",
    independenceSubtitle: "Not Affiliated with Schools",
    independenceText: "WSH is NOT affiliated with any school and operates as its own platform, just like any other social media. The platform is still in its early days, and students are lucky to witness it early on and have a chance to make it great.",
    independenceText2: "We expect feedback from users early on to make the app better through new features and improvements.",

    footerTagline: "WSH - Where Stuff Happens",
    footerContact: "Contact",
    footerSocial: "Follow Us",
    footerCopyright: "© 2025 WSH Network. All rights reserved.",
  },

  fr: {
    theProblem: "Le Problème",
    ourSolution: "Notre Solution",
    identity: "Identité",
    categories: "Catégories",
    value: "Valeur",
    legal: "Légal",
    download: "Télécharger",

    heroSubtitle: "Le Premier Réseau Social Étudiant",
    heroTagline: "Ton université, tes pensées, ta voix. Sans filtre.",
    learnMore: "En Savoir Plus",

    problemTitle: "Le Problème",
    problemSubtitle: "Aucun Moyen de Se Connecter",
    problemText1: "Actuellement, il n'existe aucun moyen facile ou centralisé pour les étudiants de contacter leurs camarades au sein d'une université. Les étudiants s'appuient sur des canaux dispersés et non officiels comme les groupes WhatsApp, les stories Instagram ou les emails de masse.",
    problemText2: "Ces canaux sont fragmentés, difficiles à naviguer et limités à de petits cercles.",

    solutionTitle: "Notre Solution",
    solutionSubtitle: "WSH - Where Stuff Happens",
    solutionText: "WSH est une plateforme de médias sociaux privée, centrée sur l'école et conçue exclusivement pour les étudiants universitaires. Elle offre un environnement sécurisé où les étudiants peuvent participer à des discussions, partager du contenu et se connecter avec leurs pairs au sein de leur communauté universitaire.",
    solutionFeature1: "Connexions étudiantes en temps réel",
    solutionFeature2: "Réseaux spécifiques à l'université",
    solutionFeature3: "Environnement sûr et modéré",

    identityTitle: "Tu Choisis Comment Tu Apparais",
    identityHandle: "Pseudo",
    identityHandleDesc: "Ton nom d'utilisateur unique. Construis ta réputation au fil du temps.",
    identityAlias: "Alias",
    identityAliasDesc: "Un nom temporaire réutilisable pour des publications contextuelles.",
    identityAnonymous: "Anonyme",
    identityAnonymousDesc: "Publie sans ton nom. Liberté d'expression pure, sans pression sociale.",

    categoriesTitle: "Catégories de Publications",
    categoriesSubtitle: "Contenu Organisé",
    categoriesText: "Les publications peuvent être organisées en catégories par les utilisateurs, et les utilisateurs peuvent parcourir ces catégories spécifiques pour trouver du contenu pertinent.",
    catPoll: "Sondage",
    catQuestion: "Question",
    catConfession: "Confession",
    catAdvice: "Conseil",
    catCrush: "Crush",
    catMeme: "Meme",
    catEvent: "Événement",
    catAnnouncement: "Annonce",
    catDebate: "Débat",
    catLifeHack: "Astuce",

    moderationTitle: "Système de Modération",
    moderationSubtitle: "La Sécurité Avant Tout",
    moderationText: "Notre approche de modération repose sur deux niveaux complémentaires : la modération IA comme première ligne de défense, et les modérateurs étudiants pour une surveillance communautaire.",
    moderationFeature1: "Filtrage de contenu OpenAI + modération d'images IA WebPurify",
    moderationFeature2: "Communauté de modérateurs étudiants avec contexte local",
    moderationFeature3: "Examen du contenu en temps réel",
    moderationFeature4: "Système de sécurité un-email-par-étudiant",
    moderationNote: "Chaque étudiant ne possède qu'une seule adresse email universitaire. Si un utilisateur est banni définitivement, il ne peut pas rejoindre la plateforme.",

    valueTitle: "La Valeur",
    valueSubtitle: "Construire une Communauté",
    valueText: "La valeur principale est de fournir un espace en ligne où les étudiants peuvent s'exprimer librement dans un espace conçu pour eux, sans les pressions des médias sociaux traditionnels.",
    valueFeature1: "Se connecter avec des pairs de ton université",
    valueFeature2: "Rester informé des actualités et événements de l'école",
    valueFeature3: "Atteindre les étudiants de toutes les années et campus",
    valueFeature4: "Favoriser un engagement communautaire authentique",
    valueFeature5: "Échanger des idées et de l'aide académique",
    valueFeature6: "Partager des expériences sociales sans pression",

    independenceTitle: "Indépendance de la Plateforme",
    independenceSubtitle: "Non Affilié aux Écoles",
    independenceText: "WSH n'est PAS affilié à aucune école et fonctionne comme sa propre plateforme, tout comme n'importe quel autre média social. La plateforme en est encore à ses débuts, et les étudiants ont la chance d'en être témoins tôt et d'avoir une chance de la rendre géniale.",
    independenceText2: "Nous attendons des retours des utilisateurs dès le début pour améliorer l'application grâce à de nouvelles fonctionnalités et améliorations.",

    footerTagline: "WSH - Where Stuff Happens",
    footerContact: "Contact",
    footerSocial: "Suivez-Nous",
    footerCopyright: "© 2025 WSH Network. Tous droits réservés.",
  }
};

// ===== STATE =====
let currentLang = 'en';

// ===== APPLY TRANSLATIONS =====
function applyTranslations(lang) {
  const t = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.textContent = t[key];
    }
  });
  // Update html lang attribute
  document.documentElement.lang = lang;
}

// ===== LANGUAGE TOGGLE =====
const langToggle = document.getElementById('lang-toggle');
const langLabel = document.getElementById('lang-label');

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'fr' : 'en';
  langLabel.textContent = currentLang === 'en' ? 'FR' : 'EN';
  applyTranslations(currentLang);
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const iconMenu = document.getElementById('icon-menu');
const iconClose = document.getElementById('icon-close');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  iconMenu.style.display = isOpen ? 'none' : 'block';
  iconClose.style.display = isOpen ? 'block' : 'none';
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    iconMenu.style.display = 'block';
    iconClose.style.display = 'none';
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== INIT =====
applyTranslations(currentLang);
