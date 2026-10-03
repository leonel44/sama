export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'terroir' | 'occidentale' | 'grillades' | 'accompagnements' | 'dessert';
  categoryLabel: string;
  tag?: string;
  tagColor?: 'yellow' | 'red' | 'green' | 'dark';
  image: string;
  prepTime?: string;
  origin?: string;
  diet?: ('terroir' | 'occidentale' | 'grillades' | 'halal' | 'vege' | 'dessert')[];
  options?: string[];
  portionInfo?: string;
  ingredients?: string[];
  isAvailable?: boolean; // In stock or temporarily unavailable
}

export interface SiteConfig {
  restaurantName: string;
  tagline: string;
  description: string;
  whatsappPrimary: string; // e.g. "237694920228"
  whatsappSecondary: string; // e.g. "237672555864"
  phoneDisplay: string; // e.g. "694-92-02-28"
  phoneSecondaryDisplay: string; // e.g. "672-55-58-64"
  isKitchenOpen: boolean;
  openingHours: string; // e.g. "08h00 - 21h30"
  serviceHoursNotice: string; // e.g. "Cuisine Ouverte • Service Midi & Soir • Commandes jusqu'à 20h30"
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  specialEventBanner: {
    enabled: boolean;
    title: string;
    subtitle: string;
    date: string;
    location: string;
    badgeText: string;
    buttonText: string;
    description: string;
  };
}

export interface CartItem {
  id: string; // unique item entry (dishId + option)
  dish: Dish;
  quantity: number;
  selectedOption?: string;
  specialNotes?: string;
}

export interface Quartier {
  id: string;
  name: string;
  details: string;
  fee: number;
  time: string;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  quartier: string;
  quote: string;
  rating: number;
  initials: string;
  initialsColor: string;
}

export interface DayMenu {
  key: string;
  label: string;
  dateStr?: string;
  dishName: string;
  subtitle: string;
  side: string;
  price: number;
  isToday?: boolean;
  desc: string;
  availableTime: string;
  flyerDishId?: string;
}

export type ViewType = 'accueil' | 'menu-carte' | 'menu-du-jour' | 'commander' | 'traiteur' | 'admin';
