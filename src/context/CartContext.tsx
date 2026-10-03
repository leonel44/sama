import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dish, CartItem, Quartier, ViewType, DayMenu, SiteConfig } from '../types';
import { QUARTIERS } from '../data/quartiers';
import { DISHES, WEEK_MENU } from '../data/dishes';
import { DEFAULT_SITE_CONFIG } from '../data/siteConfig';

interface CartContextType {
  items: CartItem[];
  addToCart: (dish: Dish, quantity?: number, selectedOption?: string, specialNotes?: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  selectedQuartier: Quartier;
  setSelectedQuartier: (q: Quartier) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  activeModalDish: Dish | null;
  setActiveModalDish: (dish: Dish | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  totalItemsCount: number;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  sendWhatsAppOrder: (details?: {
    clientName?: string;
    phone?: string;
    address?: string;
    notes?: string;
    paymentMethod?: string;
    timeSlot?: string;
  }) => void;

  // Live menu management (Cheffe Samantha & Manager)
  dishes: Dish[];
  weekMenu: DayMenu[];
  todaySpecialDish: Dish;
  tomorrowSpecialDish: Dish;
  todaySpecialId: string;
  tomorrowSpecialId: string;
  setTodaySpecialId: (dishId: string) => void;
  setTomorrowSpecialId: (dishId: string) => void;
  addDish: (newDish: Dish, setAsToday?: boolean, setAsTomorrow?: boolean) => void;
  updateDish: (dishId: string, updated: Partial<Dish>) => void;
  deleteDish: (dishId: string) => void;
  toggleDishAvailability: (dishId: string) => void;
  updateWeekDayMenu: (key: string, updated: Partial<DayMenu>) => void;
  resetMenuToDefaults: () => void;

  // Quartiers & Delivery Management
  quartiers: Quartier[];
  updateQuartier: (id: string, updated: Partial<Quartier>) => void;
  addQuartier: (q: Quartier) => void;
  deleteQuartier: (id: string) => void;

  // Site Configuration & Customization
  siteConfig: SiteConfig;
  updateSiteConfig: (updated: Partial<SiteConfig>) => void;
  resetSiteConfig: () => void;

  // Discreet Admin Authentication
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  adminPin: string;
  verifyAdminPin: (pin: string) => boolean;
  setAdminPin: (newPin: string) => void;
  logoutAdmin: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DISHES_STORAGE_KEY = 'samantha_food_dishes_v1';
const WEEK_MENU_STORAGE_KEY = 'samantha_food_week_menu_v1';
const TODAY_SPECIAL_KEY = 'samantha_food_today_special_id_v1';
const TOMORROW_SPECIAL_KEY = 'samantha_food_tomorrow_special_id_v1';
const ADMIN_PIN_KEY = 'samantha_admin_pin_code_v1';
const ADMIN_AUTH_KEY = 'samantha_admin_session_auth_v1';
const SITE_CONFIG_KEY = 'samantha_food_site_config_v1';
const QUARTIERS_STORAGE_KEY = 'samantha_food_quartiers_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Site Config (Restaurant settings, phone numbers, hero texts, event banner)
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(SITE_CONFIG_KEY);
      if (saved) {
        return { ...DEFAULT_SITE_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Could not load siteConfig from localStorage", e);
    }
    return DEFAULT_SITE_CONFIG;
  });

  const updateSiteConfig = (updated: Partial<SiteConfig>) => {
    setSiteConfig(prev => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  const resetSiteConfig = () => {
    setSiteConfig(DEFAULT_SITE_CONFIG);
    try {
      localStorage.removeItem(SITE_CONFIG_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  // 2. Quartiers & Delivery Fees
  const [quartiers, setQuartiers] = useState<Quartier[]>(() => {
    try {
      const saved = localStorage.getItem(QUARTIERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not load quartiers from localStorage", e);
    }
    return QUARTIERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(QUARTIERS_STORAGE_KEY, JSON.stringify(quartiers));
    } catch (e) {
      console.warn(e);
    }
  }, [quartiers]);

  const updateQuartier = (id: string, updated: Partial<Quartier>) => {
    setQuartiers(prev => prev.map(q => q.id === id ? { ...q, ...updated } : q));
  };

  const addQuartier = (q: Quartier) => {
    setQuartiers(prev => [...prev, q]);
  };

  const deleteQuartier = (id: string) => {
    setQuartiers(prev => prev.filter(q => q.id !== id));
  };

  // 3. Dynamic Dishes State (persisted in localStorage)
  const [dishes, setDishes] = useState<Dish[]>(() => {
    try {
      const saved = localStorage.getItem(DISHES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not load dishes from localStorage", e);
    }
    return DISHES;
  });

  // 4. Dynamic Week Menu State
  const [weekMenu, setWeekMenu] = useState<DayMenu[]>(() => {
    try {
      const saved = localStorage.getItem(WEEK_MENU_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not load weekMenu from localStorage", e);
    }
    return WEEK_MENU;
  });

  // 5. Today & Tomorrow Featured Special IDs
  const [todaySpecialId, setTodaySpecialIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(TODAY_SPECIAL_KEY);
      if (saved) return saved;
    } catch (e) {
      console.warn("Could not load todaySpecialId", e);
    }
    return 'haricots-blancs-plantain-poulet'; // Default today: Samedi 03 Oct
  });

  const [tomorrowSpecialId, setTomorrowSpecialIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(TOMORROW_SPECIAL_KEY);
      if (saved) return saved;
    } catch (e) {
      console.warn("Could not load tomorrowSpecialId", e);
    }
    return 'bouillon-patte-boeuf'; // Default tomorrow: Dimanche 04 Oct
  });

  // Persist dishes changes
  useEffect(() => {
    try {
      localStorage.setItem(DISHES_STORAGE_KEY, JSON.stringify(dishes));
    } catch (e) {
      console.warn("Could not save dishes to localStorage", e);
    }
  }, [dishes]);

  // Persist weekMenu changes
  useEffect(() => {
    try {
      localStorage.setItem(WEEK_MENU_STORAGE_KEY, JSON.stringify(weekMenu));
    } catch (e) {
      console.warn("Could not save weekMenu to localStorage", e);
    }
  }, [weekMenu]);

  const setTodaySpecialId = (dishId: string) => {
    setTodaySpecialIdState(dishId);
    try {
      localStorage.setItem(TODAY_SPECIAL_KEY, dishId);
    } catch (e) {
      console.warn("Could not save todaySpecialId", e);
    }
  };

  const setTomorrowSpecialId = (dishId: string) => {
    setTomorrowSpecialIdState(dishId);
    try {
      localStorage.setItem(TOMORROW_SPECIAL_KEY, dishId);
    } catch (e) {
      console.warn("Could not save tomorrowSpecialId", e);
    }
  };

  const addDish = (newDish: Dish, setAsToday?: boolean, setAsTomorrow?: boolean) => {
    setDishes(prev => [newDish, ...prev]);
    if (setAsToday) {
      setTodaySpecialId(newDish.id);
    }
    if (setAsTomorrow) {
      setTomorrowSpecialId(newDish.id);
    }
  };

  const updateDish = (dishId: string, updated: Partial<Dish>) => {
    setDishes(prev => prev.map(d => d.id === dishId ? { ...d, ...updated } : d));
  };

  const deleteDish = (dishId: string) => {
    setDishes(prev => prev.filter(d => d.id !== dishId));
  };

  const toggleDishAvailability = (dishId: string) => {
    setDishes(prev =>
      prev.map(d => (d.id === dishId ? { ...d, isAvailable: d.isAvailable === false ? true : false } : d))
    );
  };

  const updateWeekDayMenu = (key: string, updated: Partial<DayMenu>) => {
    setWeekMenu(prev => prev.map(m => m.key === key ? { ...m, ...updated } : m));
  };

  const resetMenuToDefaults = () => {
    setDishes(DISHES);
    setWeekMenu(WEEK_MENU);
    setQuartiers(QUARTIERS);
    setTodaySpecialId('haricots-blancs-plantain-poulet');
    setTomorrowSpecialId('bouillon-patte-boeuf');
    try {
      localStorage.removeItem(DISHES_STORAGE_KEY);
      localStorage.removeItem(WEEK_MENU_STORAGE_KEY);
      localStorage.removeItem(TODAY_SPECIAL_KEY);
      localStorage.removeItem(TOMORROW_SPECIAL_KEY);
      localStorage.removeItem(QUARTIERS_STORAGE_KEY);
    } catch (e) {
      console.warn("Could not clear localStorage", e);
    }
  };

  // 6. Admin PIN & Authentication State (Discreet & Private)
  const [adminPin, setAdminPinState] = useState<string>(() => {
    try {
      return localStorage.getItem(ADMIN_PIN_KEY) || '2026';
    } catch {
      return '2026';
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const verifyAdminPin = (entered: string): boolean => {
    if (entered.trim() === adminPin.trim()) {
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      } catch (e) {
        console.warn(e);
      }
      return true;
    }
    return false;
  };

  const setAdminPin = (newPin: string) => {
    setAdminPinState(newPin);
    try {
      localStorage.setItem(ADMIN_PIN_KEY, newPin);
    } catch (e) {
      console.warn(e);
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    } catch (e) {
      console.warn(e);
    }
    if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const todaySpecialDish = dishes.find(d => d.id === todaySpecialId) || dishes[0] || DISHES[0];
  const tomorrowSpecialDish = dishes.find(d => d.id === tomorrowSpecialId) || dishes[1] || DISHES[1];

  // 7. Cart items State
  const [items, setItems] = useState<CartItem[]>(() => {
    const okok = DISHES.find(d => d.id === 'okok-sale');
    const bissap = DISHES.find(d => d.id === 'jus-bissap');

    const initial: CartItem[] = [];
    if (okok) {
      initial.push({
        id: `${okok.id}-default`,
        dish: okok,
        quantity: 1,
        selectedOption: 'Bâtons de manioc (Inclus)',
        specialNotes: 'Piment fort à part'
      });
    }
    if (bissap) {
      initial.push({
        id: `${bissap.id}-default`,
        dish: bissap,
        quantity: 1
      });
    }
    return initial;
  });

  const [selectedQuartier, setSelectedQuartier] = useState<Quartier>(() => quartiers[0] || QUARTIERS[0]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [activeModalDish, setActiveModalDish] = useState<Dish | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('accueil');

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const addToCart = (
    dish: Dish,
    quantity: number = 1,
    selectedOption?: string,
    specialNotes?: string
  ) => {
    setItems((prevItems) => {
      const optionKey = selectedOption ? `-${selectedOption}` : '';
      const itemId = `${dish.id}${optionKey}`;
      const existing = prevItems.find((i) => i.id === itemId);

      if (existing) {
        return prevItems.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity, specialNotes: specialNotes || item.specialNotes }
            : item
        );
      } else {
        return [...prevItems, { id: itemId, dish, quantity, selectedOption, specialNotes }];
      }
    });
    showToast(`"${dish.name}" a été ajouté au panier !`);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    showToast('Plat retiré du panier');
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const deliveryFee = selectedQuartier.fee;
  const grandTotal = subtotal + deliveryFee;
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const sendWhatsAppOrder = (details?: {
    clientName?: string;
    phone?: string;
    address?: string;
    notes?: string;
    paymentMethod?: string;
    timeSlot?: string;
  }) => {
    if (items.length === 0) {
      showToast('Votre panier est vide');
      return;
    }

    const orderLines = items
      .map(
        (item) =>
          `• ${item.quantity}x *${item.dish.name}* (${(item.dish.price * item.quantity).toLocaleString('fr-FR')} FCFA)` +
          (item.selectedOption ? `\n  └ Option : ${item.selectedOption}` : '') +
          (item.specialNotes ? `\n  └ Remarque : ${item.specialNotes}` : '')
      )
      .join('\n');

    const name = details?.clientName || 'Client Samantha Food';
    const phone = details?.phone || 'Non renseigné';
    const address = details?.address || 'À préciser';
    const pay = details?.paymentMethod || 'Espèces à la livraison';
    const time = details?.timeSlot || 'Au plus vite';
    const notes = details?.notes ? `\n*Note cuisine :* ${details.notes}` : '';

    const message =
      `*NOUVELLE COMMANDE EN LIGNE — ${siteConfig.restaurantName.toUpperCase()}*\n` +
      `───────────────────────\n` +
      `*Client :* ${name}\n` +
      `*Téléphone :* +237 ${phone}\n` +
      `*Quartier Douala :* ${selectedQuartier.name} (${selectedQuartier.details})\n` +
      `*Adresse exacte :* ${address}\n` +
      `*Créneau souhaité :* ${time}\n` +
      `*Mode de règlement :* ${pay}\n` +
      `───────────────────────\n` +
      `*DÉTAIL DU PANIER :*\n${orderLines}\n` +
      `───────────────────────\n` +
      `*Sous-total repas :* ${subtotal.toLocaleString('fr-FR')} FCFA\n` +
      `*Frais de livraison :* ${deliveryFee.toLocaleString('fr-FR')} FCFA\n` +
      `*TOTAL À PAYER :* *${grandTotal.toLocaleString('fr-FR')} FCFA*` +
      notes +
      `\n\n_Merci de me confirmer la prise en charge et l'estimation du délai de livraison._`;

    const encoded = encodeURIComponent(message);
    const waNumber = siteConfig.whatsappPrimary.replace(/\D/g, '') || '237694920228';
    const waUrl = `https://wa.me/${waNumber}?text=${encoded}`;
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Commande transmise sur WhatsApp !');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        selectedQuartier,
        setSelectedQuartier,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        activeModalDish,
        setActiveModalDish,
        toastMessage,
        showToast,
        subtotal,
        deliveryFee,
        grandTotal,
        totalItemsCount,
        currentView,
        setCurrentView,
        sendWhatsAppOrder,
        dishes,
        weekMenu,
        todaySpecialDish,
        tomorrowSpecialDish,
        todaySpecialId,
        tomorrowSpecialId,
        setTodaySpecialId,
        setTomorrowSpecialId,
        addDish,
        updateDish,
        deleteDish,
        toggleDishAvailability,
        updateWeekDayMenu,
        resetMenuToDefaults,
        quartiers,
        updateQuartier,
        addQuartier,
        deleteQuartier,
        siteConfig,
        updateSiteConfig,
        resetSiteConfig,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        adminPin,
        verifyAdminPin,
        setAdminPin,
        logoutAdmin
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
