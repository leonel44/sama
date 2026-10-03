import { SiteConfig } from '../types';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  restaurantName: 'Samantha Food',
  tagline: "Saveurs d'Exception",
  description: 'Des plats savoureux et faits avec passion — Tous les types de repas au bon goût ! Cuisine camerounaise du terroir et cuisine internationale.',
  whatsappPrimary: '237694920228',
  whatsappSecondary: '237672555864',
  phoneDisplay: '694-92-02-28',
  phoneSecondaryDisplay: '672-55-58-64',
  isKitchenOpen: true,
  openingHours: '08h00 - 21h30',
  serviceHoursNotice: 'Cuisine Ouverte • Service Midi & Soir • Commandes prises jusqu’à 20h30',
  heroTitle: 'Des plats savoureux et faits avec passion —',
  heroHighlight: 'Tous les types de repas au bon goût !',
  heroSubtitle: 'Spécialités africaines du terroir, cuisine internationale, grillades braisées, pâtes & douceurs livrées chaudes partout à Douala. Préparées minute selon les plus hauts standards d’hygiène.',
  specialEventBanner: {
    enabled: true,
    title: 'DIMANCHE CASIER À PK17 (FACE AU CAMPUS)',
    subtitle: 'Événement Spécial du Dimanche',
    date: 'Dimanche 04 Octobre 2026',
    location: 'Douala PK17, face au campus universitaire (Dès 09h00)',
    badgeText: '🔥 Spécial Terroir & Convivialité',
    buttonText: 'Réserver ma part de Bouillon',
    description: 'Grand Bouillon chaud Patte de Bœuf aux épices locales parfumées + Bâtons de manioc doux ou plantains bouillis (2.500 FCFA). Bière fraîche à 800 F ou Casier complet à 9.500 F.'
  }
};
